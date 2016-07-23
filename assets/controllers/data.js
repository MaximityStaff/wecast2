
var app = angular.module('data', ['chart.js']).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 5000;
}]).config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts 
    ChartJsProvider.setOptions({
      chartColors: ["#46BFBD", "#FDB45C", "#212121", "#64af9c", "#6b1f3c", "#127690", "#a2798f", "#008b8b", "#99ccff", "#cc99ff", "#9feaae", "#40d65d", "#65ada2", "#5ee4bb", "#9ffff7", "#2412b4", "#34d491", "#da6665", "#f3d681", "#b9b9b9", "#b9b9b9", "#ffae1a", "#2137ff", "#d8941a", "#d8941a", "#ff2a1a", "#e6b3e6", "#e6b3e6", "#a8e4f0", "#6ef79c", "#5cf53d", "#d6d65c", "#adb87a", "#d6995c", "#f76e6e", "#f08a75", "#eb9947", "#ffdd33", "#cccc00", "#99eb47", "#75f075", "#85e0b3", "#33ffdd","#998cd9"],
      responsive: false
    });
    // Configure all line charts 
    ChartJsProvider.setOptions('line', {
      showLines: true
    });
  }]);

var QueryString = function () {  //提取由公众號或分享LINK時的CODE參數
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  //alert(window.location.search+" "+query);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
    return query_string;
}();

var debug = true;

app.controller('IndexCtrl', [
'$scope','$http', '$timeout', '$interval', '$location', '$anchorScroll',
function($scope, $http, $timeout, $interval, $location, $anchorScroll){
  $scope.color = ["#46BFBD", "#FDB45C", "#212121", "#64af9c", "#6b1f3c", "#127690", "#a2798f", "#008b8b", "#99ccff", "#cc99ff", "#9feaae", "#40d65d", "#65ada2", "#5ee4bb", "#9ffff7", "#2412b4", "#34d491", "#da6665", "#f3d681", "#b9b9b9", "#b9b9b9", "#ffae1a", "#2137ff", "#d8941a", "#d8941a", "#ff2a1a", "#e6b3e6", "#e6b3e6", "#a8e4f0", "#6ef79c", "#5cf53d", "#d6d65c", "#adb87a", "#d6995c", "#f76e6e", "#f08a75", "#eb9947", "#ffdd33", "#cccc00", "#99eb47", "#75f075", "#85e0b3", "#33ffdd","#998cd9"];
  $scope.action = {
    regist : false,
    share_friend : false,
    share_timeline : false,
    share_button : false,
    rules : false,
    google_map : false,
    tel : false,
    redeem_prize1 : false,
    redeem_prize2 : false,
    continue_collect : false,
    thankyou_page : false,
    total_share_friends : false,
    redeem_vote : false
  };
  $scope.actionMap = {};
  $scope.actionMap['regist'] = "註冊" ;
  $scope.actionMap['share_friend'] = "微信朋友分享次數" ;
  $scope.actionMap['share_timeline'] = "微信朋友圈分享次數" ;
  $scope.actionMap['share_button'] = "分享按鈕" ;
  $scope.actionMap['about_easywash'] = "活動詳情" ;
  $scope.actionMap['rules'] = "活動規則" ;
  $scope.actionMap['address'] = "地址MAP";
  $scope.actionMap['google_map'] = "立即前往" ;
  $scope.actionMap['tel'] = "CALL客服";
  $scope.actionMap['prize1_page'] = "獎品1詳情";
  $scope.actionMap['prize2_page'] = "獎品2詳情" ;
  $scope.actionMap['redeem_prize1'] = "獎品1成功領獎";
  $scope.actionMap['redeem_prize2'] = "獎品2成功領獎";
  $scope.actionMap['continue_collect'] = "繼續儲泡";
  $scope.actionMap['go_wash'] = '去洗車';
  $scope.actionMap['prize1_return'] = "獎品1返回";
  $scope.actionMap['prize2_return'] = "獎品2返回";
  $scope.actionMap['about_easywash_return'] = "活動詳情返回";
  $scope.actionMap['thankyou_page'] = "Thank You頁面";
  $scope.actionMap['total_share_friends'] = "分享朋友總數";
  $scope.actionMap['redeem_vote'] = "雙倍積分";

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  // Simulate async data update 
  $timeout(function () {
    $scope.data = [
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40]
    ];
  }, 3000);

  $scope.init = function () {
    var now = new Date();
    console.log(now);
    $scope.year = now.getFullYear();
    $scope.month = now.getMonth()+1;
    $scope.date = now;
  };

  $scope.allAction = function () {
    console.log("click all");
    angular.forEach($scope.action, function(value, key) {
      $scope.action[key] = $scope.clickAll;
    });
  };
  $scope.getMonthData = function () {
    $scope.buttonAction = 'accessMonth';
  };
  $scope.chartColor = function (index) {
    $scope.color[index];
  };
  $scope.renderChart = function () {
    
  }
}]);
