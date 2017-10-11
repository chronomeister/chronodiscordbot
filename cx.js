var exports = module.exports = {};
var request = require('request');


exports.currencyexchange = function(msg, cx) {
	if (cx[1]) {cx[1] = cx[1].replace(/(\/|\\|=[Xx]|,)/g, "");}
	if (cx[0].length != 6){msg.channel.send("Invalid format. Please express conversion as six character format. eg: USDJPY"); return;}
	if (cx[1] && !/[\d.$¥]+/.test(cx[1])) {msg.channel.send("Invalid number. Please restrict your value to numbers and decimal point."); return;}
	var mult = 1;
	var from = cx[0].substr(0,3).toLowerCase();
	var to =  cx[0].substr(3,3).toLowerCase();
	var fromdsp = from.toUpperCase();
	var todsp = to.toUpperCase();
	var specials = ["spk","pul","jew"];
	if (specials.indexOf(from) > -1) {
		switch (from) {
			case "spk":
				fromdsp = "Spark";
				mult *= 87500;
				break;
			case "pul":
				fromdsp = "10-pull";
				mult *= 9800.0/8400*2500;
				break;
			case "jew":
				fromdsp = "Jewel(s)";
				mult *= 9800.0/8400;
				break;
		}
		from = "jpy";
	}
	if (specials.indexOf(to) > -1) {
		switch (to) {
			case "spk":
				todsp = "Spark";
				mult *= 1/87500;
				break;
			case "pul":
				todsp = "10-pull";
				mult *= 1/(9800.0/8400*2500);
				break;
			case "jew":
				todsp = "Jewel(s)";
				mult *= 1/(9800.0/8400);
				break;
		}
		to = "jpy";
	}
	var qry = `select * from yahoo.finance.xchange where pair in ("${from}${to}")`
	request.get({
		url : 'https://query.yahooapis.com/v1/public/yql',
		qs : {
			'q' : qry,
			'format' : 'json',
			'env' : 'store://datatables.org/alltableswithkeys',
			'callback' : ''
		},
		body : ''
	}, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var cxrate = JSON.parse(response.body);
			//console.dir(response);
			if (cxrate.query.results.rate.name == "N/A") {
				msg.channel.send("Invalid country code(s)");
			} else if (cx[1]) {
				msg.channel.send(cx[1] + " " + fromdsp + " in " + todsp + " is: " + (cxrate.query.results.rate.Rate * cx[1]) * mult);
			} else {
				msg.channel.send("Current " + fromdsp + " to " + todsp + " rate is: " + cxrate.query.results.rate.Rate * mult);
			}
		} else if (!error && response.statusCode == 500) {
			msg.channel.send("Internal server error. Try again later.");
		} else if (!error && response.statusCode == 422) {
			msg.channel.send("Invalid country code");
		}
	});
}
