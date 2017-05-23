var exports = module.exports = {};

exports.region = function(msg, params) {
    var txt = params.join('  ');
    if (params.join('').length > 10 && msg.author.id != 93389633261416448) return;
    var out = txt.replace(/([a-zA-Z])/g, ':regional_indicator_$1:');
    msg.channel.sendMessage(out.toLowerCase());
}
