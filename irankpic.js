var exports = module.exports = {};
var jsf = require('jsonfile');

exports.pic = function(msg) {
    if (Date.now() < Date.parse((jsf.readFileSync("./imasevent.json")).end))
    {
        msg.channel.sendFile('./TIME2RANK.png');
    }
}
