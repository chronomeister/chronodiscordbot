var exports = module.exports = {};
var request = require('request');
var configs = require('./cbotconfig.json');

exports.currencyexchange = function(msg, cx) {
	if (cx[1]) {cx[1] = cx[1].replace(/(\/|\\|=[Xx]|,)/g, "");}
	if (cx[0].length != 6){msg.channel.send("Invalid format. Please express conversion as six character format. eg: USDJPY"); return;}
	if (cx[1] && !/[\d.$¥]+/.test(cx[1])) {msg.channel.send("Invalid number. Please restrict your value to numbers and decimal point."); return;}
	var mult = 1;
	var from = cx[0].substr(0,3).toUpperCase();
	var to =  cx[0].substr(3,3).toUpperCase();
	var fromdsp = from;
	var todsp =  to;

	var specials = ["SPK","PUL","JEW","MBC"];
	if (specials.indexOf(from) > -1) {
		switch (from) {
			case "SPK":
				fromdsp = "Spark";
				mult *= 87500;
				break;
			case "PUL":
				fromdsp = "10-pull";
				mult *= 9800.0/8400*2500;
				break;
			case "JEW":
				fromdsp = "Jewel(s)";
				mult *= 9800.0/8400;
				break;
			case "MBC":
				fromdsp = "MobaCoin(s)";
				mult *= 103.0/100;
				break;
		}
		from = "JPY";
	}
	if (specials.indexOf(to) > -1) {
		switch (to) {
			case "SPK":
				todsp = "Spark";
				mult *= 1/87500;
				break;
			case "PUL":
				todsp = "10-pull";
				mult *= 1/(9800.0/8400*2500);
				break;
			case "JEW":
				todsp = "Jewel(s)";
				mult *= 1/(9800.0/8400);
				break;
			case "MBC":
				todsp = "MobaCoin(s)";
				mult *= 1/(103.0/100);
				break;
		}
		to = "JPY";
	}
	request.get({
		url : 'http://data.fixer.io/api/latest',
		qs : {
			'access_key' : configs.fixerkey
		},
		body : ''
	}, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var cxrate = JSON.parse(response.body);
			// console.dir(response);
			if (cxrate.rates == null) {
				msg.channel.send("couldnt get exchange rate data, something broke. Ping/Dab chronomeister");
			} else if (!cxrate.rates[from] || !cxrate.rates[to]) {
				msg.channel.send("Invalid country code(s)");
			} else if (cx[1]) {
				msg.channel.send(cx[1] + " " + fromdsp + " in " + todsp + " is: " + (cx[1] * mult / cxrate.rates[from] * cxrate.rates[to]));
			} else {
				msg.channel.send("Current " + fromdsp + " to " + todsp + " rate is: " + mult / cxrate.rates[from] * cxrate.rates[to]);
			}
		} else if (!error && response.statusCode == 500) {
			msg.channel.send("Internal server error. Try again later.");
		} else if (!error && response.statusCode == 422) {
			msg.channel.send("Invalid country code");
		}
	});
}
