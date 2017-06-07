var exports = module.exports = {};
var request = require('request');

exports.currencyexchange = function(msg, cx) {
    if (cx[1]) {cx[1] = cx[1].replace(/(\/|\\|=[Xx]|,)/g, "");}
    if (cx[0].length != 6){msg.channel.send("Invalid format. Please express conversion as six character format. eg: USDJPY"); return;}
    if (cx[1] && !/[\d.$¥]+/.test(cx[1])) {msg.channel.send("Invalid number. Please restrict your value to numbers and decimal point."); return;}
    var from = cx[0].substr(0,3);
    var to =  cx[0].substr(3,3);
    var cxurl = `http://api.fixer.io/latest?base=${from}&symbols=${to}`
    // msg.reply(cxurl);
    request(cxurl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var cxrate = JSON.parse(response.body);
			//console.dir(response);
            if (!cxrate.rates[to] || cxrate.error) {
                msg.channel.send("Invalid country code(s)");
            } else if (cx[1]) {
                msg.channel.send(cx[1] + " " + from + " in " + to + " is: " + (cxrate.rates[to] * cx[1]));
            } else {
                msg.channel.send("Current " + from + " to " + to + " rate is: " + cxrate.rates[to]);
            }
        } else if (!error && response.statusCode == 500) {
            msg.channel.send("Internal server error. Try again later.");
		} else if (!error && response.statusCode == 422) {
            msg.channel.send("Invalid country code(s)");
        }
    });
}
