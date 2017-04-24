var exports = module.exports = {};
exports.time = function(msg, qary) {
    // assume UTC for everything
    var serval = msg.guild.emojis.find(function(emoji){return emoji.name === 'muri';});
    var firstep = new Date(Date.UTC(2017,03,04,12,55));
    var now = Date.now();
    var nextepnum = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor((now - firstep) / 1000) / 60) / 60) / 24) / 7) + 2;
    var nexteptime = new Date(firstep.getTime() + (nextepnum - 1) * 7 * 24 * 60 * 60 * 1000);
    var time = nexteptime - now;
    var days = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);
    var hours = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
    var minutes = Math.floor(Math.floor(time / 1000) / 60) % 60;
    var seconds = Math.floor(time / 1000) % 60;
    if (days == 6) {msg.channel.sendMessage((serval ?`${serval} `: "") + "EPISODE " + (nextepnum - 1) + " IS OUT! WATCH IT NOW!" + (serval ?` ${serval}`: ""));}
    var message = (serval ?`${serval} `: "") + "Episode " + nextepnum + " of Cinderella Girls Gekijou airs in " +
       ((days > 0) ? days + " day" + (days == 1 ? "" : "s") + " " : "") +
       ((hours > 0) ? hours + " hour" + (hours == 1 ? "" : "s") + " " : "") +
       ((minutes > 0) ? minutes + " minute" + (minutes == 1 ? "" : "s") + " " : "") +
       ((seconds > 0) ? seconds + " second" + (seconds == 1 ? "" : "s") + " " : "") +
       (serval ?`${serval}`: "");
    return msg.channel.sendMessage(message);
    // msg.channel.sendMessage((serval ?`${serval} `: "") + "EPISODE 12 IS OUT! WATCH IT NOW!" + (serval ?` ${serval}`: ""));
}
