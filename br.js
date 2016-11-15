var exports = module.exports = {};
var jsonfile = require('jsonfile');
var quotefile = './br.json';

var quotes = jsonfile.readFileSync(quotefile);

exports.bobross = function(msg) {
    var bre = msg.guild.emojis.find(function(emoji){return emoji.name === 'bobross';});
    msg.channel.sendMessage(quotes[Math.floor(Math.random()*quotes.length)] + (bre ?` ${bre} `: ""));
}
