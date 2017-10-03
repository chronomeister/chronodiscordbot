var exports = module.exports = {};

exports.updatemsg = function(msg) {
    // assume UTC for everything
	var serval = msg.guild.emojis.find(function(emoji){return emoji.name === 'muri';});
    var firstep = new Date(Date.UTC(2017,09,03,12,55));
    var now = Date.now();
    var nextepnum = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor((now - firstep) / 1000) / 60) / 60) / 24) / 7) + 2;
    if (nextepnum > 12) return;
    var nexteptime = new Date(firstep.getTime() + (nextepnum - 1) * 7 * 24 * 60 * 60 * 1000);
    var time = nexteptime - now;
    var days = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);
    var hours = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
    var minutes = Math.floor(Math.floor(time / 1000) / 60) % 60;
    var seconds = Math.floor(time / 1000) % 60;
    if (days == 6 && hours == 23 && minutes == 59 && seconds > 56) {msg.channel.send((serval ?`${serval} `: "") + "EPISODE " + (nextepnum - 1) + " OF CINDERELLA GIRLS GEKIJOU SEASON 2 IS OUT! WATCH IT NOW!" + (serval ?` ${serval}`: ""));}
	var message = (serval ?`${serval} `: "") + "Episode " + nextepnum + " of Cinderella Girls Gekijou Season 2 airs in " +
        ((days > 0) ? days + " day" + (days == 1 ? "" : "s") + " " : "") +
        ((hours > 0) ? hours + " hour" + (hours == 1 ? "" : "s") + " " : "") +
        ((minutes > 0) ? minutes + " minute" + (minutes == 1 ? "" : "s") + " " : "") +
        ((seconds > 0) ? seconds + " second" + (seconds == 1 ? "" : "s") + " " : "") +
        (serval ?`${serval}`: "");
    msg.edit(message);
}
