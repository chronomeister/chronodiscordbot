var exports = module.exports = {};
var jsf = require('jsonfile');

exports.pic = function(msg) {
    var eventparams = (jsf.readFileSync("./imasevent.json"))
    var finish = Date.parse(eventparams.end);
    if (Date.now() < finish)
    {
        var time = finish - Date.now();
        var days = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);
        var hours = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
        var minutes = Math.floor(Math.floor(time / 1000) / 60) % 60;
        var seconds = Math.floor(time / 1000) % 60;
        var message = "Only " +
            ((days > 0) ? days + " day" + (days == 1 ? "" : "s") + " " : "") +
            ((hours > 0) ? hours + " hour" + (hours == 1 ? "" : "s") + " " : "") +
            ((minutes > 0) ? minutes + " minute" + (minutes == 1 ? "" : "s") + " " : "") +
            ((seconds > 0) ? seconds + " second" + (seconds == 1 ? "" : "s") + " " : "") +
            "left to protect " + eventparams.protect;
        msg.channel.send(message);
        msg.channel.sendFile('./TIME2RANK.png');
    }
}
