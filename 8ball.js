var exports = module.exports = {};
var eball = require('./8ballrsp.json');
exports.eightball = function(msg) {
    msg.reply(eball[Math.floor(Math.random() * eball.length)]);
}
