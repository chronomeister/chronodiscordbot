var exports = module.exports = {};
var request = require('request');

exports.currencyexchange = function(msg, cx) {
    var from = cx.substr(0,3);
    var to =  cx.substr(3,3);
    var cxurl = `http://rate-exchange-1.appspot.com/currency?from=${from}&to=${to}`
    // msg.reply(cxurl);
    request(cxurl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var cxrate = JSON.parse(response.body);
            // console.dir(response.body);
            if (cxrate.err) {
                msg.channel.sendMessage("Invalid country code(s)");
            } else {
                msg.channel.sendMessage("Current " + from + " to " + to + " rate is: " + cxrate.rate);
            }
        } else if (!error && response.statusCode == 500) {
            msg.channel.sendMessage("Invalid country code(s)");
        }
    });
}
