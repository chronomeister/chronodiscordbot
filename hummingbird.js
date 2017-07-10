var exports = module.exports = {};

exports.when = function(msg) {
	var n = new Date();
	var r = new Date(Date.UTC(2017,08,19,15));
	var time = r - n;
    var days = Math.floor(Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) / 24);
    var hours = Math.floor(Math.floor(Math.floor(time / 1000) / 60) / 60) % 24;
    var minutes = Math.floor(Math.floor(time / 1000) / 60) % 60;
    var seconds = Math.floor(time / 1000) % 60;
	var message = "The release of Hummingbird on THE IDOLM@STER MILLION LIVE! M@STER SPARKLE 02 CD is in " +
		((days > 0) ? days + " day" + (days == 1 ? "" : "s") + " " : "") +
		((hours > 0) ? hours + " hour" + (hours == 1 ? "" : "s") + " " : "") +
		((minutes > 0) ? minutes + " minute" + (minutes == 1 ? "" : "s") + " " : "") +
		((seconds > 0) ? seconds + " second" + (seconds == 1 ? "" : "s") + " " : "");
	msg.channel.send(message);
}
