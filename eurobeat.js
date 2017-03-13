var exports = module.exports = {};
var lists = require('./eurobeat.json');
var favored = 0.5;

exports.drift = function(msg) {
    var list;
    if (Math.random() < favored) {
        list = lists[0];
    } else {
        list = lists[1];
    }
    var pick = list[Math.floor(Math.random() * list.length)];
    msg.channel.sendMessage(pick.url);
}
