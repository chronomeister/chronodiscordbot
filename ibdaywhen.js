var exports = module.exports = {};
var mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
exports.when = function(msg, params) {
	var idols = require('./idolbday.json');
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
			nowbday.forEach(function(val){
				var dispname = val.name + (val.seiyuu ? ", seiyuu of " + val.seiyuu : "");
				msglist.push(`  ${dispname} from ${val.series}`);
			});
		}
		if (tmrbday.length < 1) {
			msglist.push("No idol birthdays tomorrow.");
		}
		else {
			msglist.push("Tomorrow's idol birthdays:");
			tmrbday.forEach(function(val){
				var dispname = val.name + (val.seiyuu ? ", seiyuu of " + val.seiyuu : "");
				msglist.push(`  ${dispname} from ${val.series}`);
			});
		}
		if (tmrbday.length + nowbday.length == 0) msglist.push(":FeelsBadMan:");
	} else {
		var namelist = [];
		var isName = isNaN(Date.parse(params[0]));
		if (isName) {
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
		} else {
			var c = new Date(params[0]);
			var m = c.getMonth() + 1;
			idols.forEach(function(idol){
				if (idol.month - 1 === c.getMonth() && idol.day - 0 === c.getDate() - 0)
				{
					namelist.push(idol);
				}
			});
		}
		if (namelist.length == 0) {msglist.push(`I could not find any idol${!isName ? "'s birthdays" : "s"} matching that ${isName ? "name" : "date"}`)}
		else {
			if (namelist.length > 1) msglist.push(`I found ${namelist.length} idol${!isName ? " birthdays" : "s"} matching that ${isName ? "name" : "date"}`);
			namelist.forEach(function(val){
				var dispname = val.name + (val.seiyuu ? ", seiyuu of " + val.seiyuu : "");
				msglist.push(`${dispname} from ${val.series} has a birthday on ${mon[val.month-1]} ${val.day}`);
			});
		}
	}
	msg.channel.send(msglist.join("\n"));
}
