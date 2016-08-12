var Config = require('../lib/Config');
var Weixin = require('../lib/Weixin');

module.exports = {
	initWXqrCode: function (req, res) {
			
	},
	createConfig: function (req, res) {
		var ad = req.param('ad');
		if (!ad) {
			return res.status(404).end();
		}
		if (ad == '' || ad == 'undefined') {
			return res.status(400).end();
		}
		Config.create(ad, function (err, configOne) {
			if (err) {
				return res.status(400).json(err);
			}
			if (!configOne) {
				return res.status(400).end();
			}
			return res.json(configOne);
		});
	},
	getConfigs: function (req, res) {
		Config.findAll(function (err, configs) {
			if (err) {
				return res.status(400).json(err);
			}
			return res.json(configs);
		});
	},
	updateConfig: function (req, res) {
		var config = req.body;
		if (!config) {
			return res.status(404).end();
		}
		Config.update(config, function (err, configOne) {
			if (err) {
				return res.status(400).json(err);
			}
			return res.json(configOne);
		});
	},
	createPrize: function (req, res) {
		var ad = req.body.ad;
		var prize = req.body.prize;
		if (!ad || !vote) {
			return res.status(404).end();
		}
		Config.createPrize(ad, prize, function (err, prizeOne) {
			if (err) {
				return res.status(400).json(err);
			}
			return res.json(prizeOne);
		})
	},
	createVote: function (req, res) {
		var ad = req.body.ad;
		var vote = req.body.vote;
		if (!ad || !vote) {
			return res.status(404).end();
		}
		Config.createVote(ad, vote, function (err, voteOne) {
			if (err) {
				return res.status(400).json(err);
			}
			return res.json(voteOne);
		});
	},
	updateVoteResult: function (req, res) {
		var ad = req.body.ad;
		var vote = req.body.vote;
		if (!ad || !vote) {
			return res.status(404).end();
		}
		Config.updateVoteResult(ad, vote, function (err, voteResult) {
			if (err) {
				return res.status(400).json(err);
			}
			return res.json(voteResult);
		});
	},
	createOrEditLoginBonus: function (req, res) {
		var ad = req.body.ad;
		var index = req.body.index;
		var loginBonus = req.body.loginBonus;
		if (!ad || !loginBonus) {
			return res.status(404).end();
		}
		if (index == 'undefined') {
			index = null;
		}
		console.log(index);
		Config.createOrEditLoginBonus(ad, index, loginBonus, function (err, index, loginBonusOne) {
			if (err) {
				return res.status(400).json(err);
			}
			return res.json({index: index, loginBonus: loginBonusOne});
		})
	},
	deleteLoginBonus: function (req, res) {
		var ad = req.body.ad;
		var index = req.body.index;
		if (!ad || !index) {
			return res.status(404).end();
		}
		if (index) {
			Config.deleteLoginBonus(ad, index, function (err, index) {
				if (err) {
					return res.status(400).json(err);
				}
				if (!index) {
					return res.status(400).end();
				}
				return res.json(index);
			});
		}
	}
}