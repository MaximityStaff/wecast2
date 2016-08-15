var request = require('request');
var eventEmitter = require('events').EventEmitter;

var sha1 = require('sha1');
var User = require('../lib/User');
var Config = require('../lib/Config');
var LoginToken = require('../lib/LoginToken');
var Weixin = require('../lib/Weixin');
var WxToken = require('../lib/WxToken');
var Merchant = require('../lib/Merchant');
var Log = require('../lib/Log');
var crypto = require('crypto');

var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

module.exports = {
	init: function(req, res) { //首次進入會跑的流程
    var code = req.param("code");
    var ad = req.param("ad");
    var url = req.param("url");
    var retResult = {};
    if (code == 'undefined' || ad == 'undefined' || url == 'undefined') {
      return res.status(400).json({errMsg: "miss param"});
    }
    var emitter = new eventEmitter();
    // step 1
    Weixin.oauth2(code, function (err, result) {
      if (err) {
        emitter.emit('error', {errMsg: JSON.stringify(err)});
      } else {
        var userInfo = {};
        userInfo.openId = result.openid;
        userInfo.accessToken = result.access_token;
        userInfo.refreshToken = result.refresh_token;
        if (result.unionid) {
          userInfo.unionId = result.unionid;
        }
        userInfo.ad = ad;
        if (sharedBy != "wecast") {
          userInfo.parent = sharedBy;
        }
        // Get UserInfo
        if (result.scope == 'snsapi_userinfo') {
          Weixin.userinfo(result.access_token, userInfo.openId, function (err, result) {
            if (err) {
              emitter.emit('error', {errMsg: JSON.stringify(err)});
            } else {
              if (result.nickname) {
                userInfo.nickname = result.nickname;
              }
              if (result.sex) {
                userInfo.sex = result.sex;
              }
              if (result.province) {
                userInfo.province = result.province;
              }
              if (result.city) {
                userInfo.city = result.city;
              }
              if (result.country) {
                userInfo.country = result.country;
              }
              if (result.headimgurl) {
                userInfo.headimgurl = result.headimgurl;
              }
              if (result.language) {
                userInfo.language = result.language;
              }
              if (result.unionid) {
                userInfo.unionId = result.unionid;
              }
              emitter.emit('userInfo', userInfo);
            }
          });

        } else {
          emitter.emit('userInfo', userInfo);
        }
        // Get UserInfo
        
      }
    });

    emitter.on('userInfo', function (userInfo) {
        User.create(userInfo, function(err, userOne){
          if(!userOne){
            emitter.emit('error', {errMsg: 'User create fail'});
          } else {

            emitter.emit('done', 'userInfo', userOne);
    
          }
        });

    });

    WxToken.validToken(function (err, wxTokenOne) {
      if (err) {
        emitter.emit('error', {errMsg: err});
      } else {
        emitter.emit('done', 'ticket', wxTokenOne);
      }
    })

    // step 2
    var events = {'userInfo': true, 'ticket': true};
    var eventResult = {};
    emitter.on('done', function (event, result) {
      eventResult[event] = result;
      delete events[event];
      if (Object.keys(events) == 0) {
        emitter.emit('final', 'userInfo', eventResult.userInfo);
        emitter.emit('final', 'ticket', eventResult.ticket);
        // // 1st
        // User.sharedToUsers_c(eventResult.userInfo, ad, function(err, sharedToUsers){
        //     emitter.emit('final', 'sharedToUsers', sharedToUsers);
        // });
        // 2nd
        Config.openDate(ad, function (err, configOne) {
          if (err) {
            emitter.emit('error', {errMsg: err});
          } else {
          	emitter.emit('final', 'config', configOne);
            if (!eventResult.userInfo.subscribe) {
              Weixin.subscribe(eventResult.ticket.access_token, eventResult.userInfo.openId, function (err, subscribe) {
                if (subscribe) {
                  eventResult.userInfo.subscribe = true;
                  User.save(eventResult.userInfo, function (err, savedUser) {
                    if (err) {
                      emitter.emit('error', {errMsg: err});
                    } else {
                      emitter.emit('final', 'subscribe', true);
                    }
                    
                  });
                } else {
                  emitter.emit('final', 'subscribe', false);
                }
              });
              
            } else {
              emitter.emit('final', 'subscribe', true);
            }
          }
          
        });
      }
    });

    // step3
    var finalEvents = {'userInfo': true, 'ticket': true, 'config': true, 'subscribe': true};
    var finalResult = {};
    emitter.on('final', function (event, result) {
      finalResult[event] = result;
      delete finalEvents[event];
      // console.log(finalEvents);
      if (Object.keys(finalEvents) == 0) {
        var timestamp = Math.floor(Date.now() / 1000);
        var noncestr = randomString(16);
        var string1 = "jsapi_ticket="+finalResult.ticket.jsapi_ticket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+url;
        var signature = sha1(string1);
        retResult.openId = finalResult.userInfo.openId;
        retResult.signature = signature;
        retResult.timestamp = timestamp;
        retResult.noncestr = noncestr;
        retResult.ticket = finalResult.ticket.jsapi_ticket;
        retResult.credit = finalResult.userInfo.credit;
        retResult.config = finalResult.config;
        retResult.subscribe = finalResult.subscribe;
        console.log(retResult);
        return res.json(retResult);
      }
    });

    emitter.once('error', function (err) {
      console.log('error: ' + JSON.stringify(err));
      return res.status(400).json(err);
    });
    

	}
}