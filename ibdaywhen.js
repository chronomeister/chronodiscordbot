var exports = module.exports = {};
var idols = require('./idolbday.json');
var mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
exports.when = function(msg, params) {
	var msglist = [];
	if (params.length < 1) {
		var t = new Date();
		t.setTime(t.getTime()+9*60*60*1000); // can now assume UTC is jp time
		var nowbday = [];
		var tmrbday = [];
		idols.forEach(function(val){if (val.day == t.getDate() && val.month == (t.getMonth() + 1)) {nowbday.push(val)}});
		t.setTime(t.getTime()+24*60*60*1000);// set it to tomorrow
		idols.forEach(function(val){if (val.day == t.getDate() && val.month == (t.getMonth() + 1)) {tmrbday.push(val)}});
		if (nowbday.length < 1) {
			msglist.push("No idol birthdays today.");
		}
		else {
			msglist.push("Today's idol birthdays:");
			nowbday.forEach(function(val){msglist.push(`  ${val.name} from ${val.series}`)});
		}
		if (tmrbday.length < 1) {
			msglist.push("No idol birthdays tomorrow.");
		}
		else {
			msglist.push("Tomorrow's idol birthdays:");
			tmrbday.forEach(function(val){msglist.push(`  ${val.name} from ${val.series}`)});
		}
		if (tmrbday.length + nowbday.length == 0) msglist.push(":FeelsBadMan:");
	} else {
		var namelist = [];
		var namerx = [];
		params.forEach(function(name){
			namerx.push(new RegExp(`\\b${name}\\b`, "i"));
		});
		idols.forEach(function(val){namelist.push(val)});
		namerx.forEach(function(rx){
			for (var i = 0; i < namelist.length; i++) {
				if (!rx.test(namelist[i].name)) {
					namelist.splice(i--,1);
				}
			}
		});
		if (namelist.length == 0) {msglist.push(`I could not find any idols matching that name`)}
		else {
			if (namelist.length > 1) msglist.push(`I found ${namelist.length} idols matching that name`);
			namelist.forEach(function(val){msglist.push(`${val.name} from ${val.series} has a birthday on ${mon[val.month-1]} ${val.day}`);});
		}
	}
	msg.channel.send(msglist.join("\n"));
}
