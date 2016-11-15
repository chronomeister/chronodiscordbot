var exports = module.exports = {};
// var jsonfile = require('jsonfile');
var quotes = require('./br.json');

// var quotes = jsonfile.readFileSync(quotefile);

exports.bobross = function(msg) {
    var bre = msg.guild.emojis.find(function(emoji){return emoji.name === 'bobRoss';});
    msg.channel.sendMessage(quotes[Math.floor(Math.random()*quotes.length)] + (bre ?` ${bre} `: ""));
}
