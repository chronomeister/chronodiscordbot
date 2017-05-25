var exports = module.exports = {};
var request = require('request');

exports.currencyexchange = function(msg, cx) {
    if (cx[1]) {cx[1] = cx[1].replace(/(\/|\\|=[Xx]|,)/g, "");}
    if (cx[0].length != 6){msg.channel.send("Invalid format. Please express conversion as six character format. eg: USDJPY"); return;}
    if (cx[1] && !/[\d.$¥]+/.test(cx[1])) {msg.channel.send("Invalid number. Please restrict your value to numbers and decimal point."); return;}
    var from = cx[0].substr(0,3);
    var to =  cx[0].substr(3,3);
    var cxurl = `http://rate-exchange-1.appspot.com/currency?from=${from}&to=${to}`
    // msg.reply(cxurl);
    request(cxurl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var cxrate = JSON.parse(response.body);
            // console.dir(response.body);
            if (cxrate.err) {
                msg.channel.send("Invalid country code(s)");
            } else if (cx[1]) {
                msg.channel.send(cx[1] + " " + from + " in " + to + " is: " + (cxrate.rate * cx[1]));
            } else {
                msg.channel.send("Current " + from + " to " + to + " rate is: " + cxrate.rate);
            }
        } else if (!error && response.statusCode == 500) {
            msg.channel.send("Internal server error. Try again later.");
        }
    });
}
