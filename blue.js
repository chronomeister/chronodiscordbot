var exports = module.exports = {};

exports.region = function(msg, params) {
    var txt = params.join('  ');
    var out = txt.replace(/([a-zA-Z])/g, ':regional_indicator_$1:');
    msg.channel.sendMessage(out.toLowerCase());
}
