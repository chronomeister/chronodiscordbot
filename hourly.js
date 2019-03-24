//SELECT '		{"id":"' || c.api_id || '","name":"' || en || '"},', en, c.api_id, api_yomi, c.api_name, b.api_name, c.api_voicef, b.api_voicef FROM jsonb_to_recordset((SELECT start2->'api_data'->'api_mst_ship' FROM kcjson ORDER BY apidate DESC LIMIT 1)) c(api_id INT, api_name TEXT, api_yomi TEXT, api_voicef INT) LEFT JOIN jsonb_to_recordset((SELECT start2->'api_data'->'api_mst_ship' FROM kcjson ORDER BY apidate DESC LIMIT 1)) b(api_id INT, api_name TEXT, api_voicef INT, api_aftershipid INT) ON (c.api_id = b.api_aftershipid) LEFT JOIN jptoenships tl ON (c.api_id = tl.api_id) WHERE c.api_voicef >= 3 AND (b.api_voicef < 3 OR b.api_voicef IS NULL) ORDER BY c.api_id

var lines = require('./hourly.json');

var request = require('request');
var dayrng = require('random-seed');
var configs = require('./cbotconfig.json');
var tls = require('./quotestl.json');
var bdays = require('./shiplaunchdatesnodupe.json');

var hours = lines.hours;
var t = new Date;
t.setTime(t.getTime()+9*60*60*1000); // can now assume UTC is jp time
var dtstr = new Date(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate());
var rndgen = dayrng(dtstr);

var todayships = [];
var todaynames = [];

bdays.list.forEach((e,i,a) => {
	// console.dir(`--${e.month}-${e.day}?`);
	if (t.getUTCMonth() + 1 == e.month && t.getUTCDate() == e.day) {
		if (t.getUTCHours() == 0) {todaynames.push(e.name);}
		hours.forEach((b) => {
			if (b.name === e.name) {
				todayships.push({"id" : b.id, "name" : b.name});
			}
		});
	}
});
todayships.sort(() => {rndgen.random()});
var hr = "0" + t.getUTCHours();
var tkey = "H" + hr.slice(hr.length-2) + "00";
// console.dir(rndgen.random());process.exit();
var line, rnd, user, id;
if (todayships.length > 0) {
	for (var i = 0; !line && i < todayships.length; i++) {
		line = tls[todayships[i]["id"]][tkey];
		user = todayships[i]["name"];
		id = todayships[i]["id"];
	}
}
while(!line) {
	rnd = Math.floor(rndgen.random()*hours.length);
	line = tls[hours[rnd]["id"]][tkey];
	user = hours[rnd]["name"];
	id = hours[rnd]["id"];
}
// https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/ships/183.png
// "https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA"
//
// console.log(tl[hours[rnd]["id"]][tkey]);
var webhooks = [
	configs.webhooks.gct.kc,
	configs.webhooks.ctbpg.wht
];
if (todaynames.length > 0) {
	var last = todaynames.pop();
	line = line + " (It's " + todaynames.join("'s, ") + (todaynames.length > 0 ? "'s and " : "") + last + "'s birthday" + (todaynames.length > 0 ? "s" : "") + " today)";
}
webhooks.forEach(function(uri){
	request.post({url:uri,
		form: {
			username: user,
			content: line,
			avatar_url:`https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/ships/${id}.png`
		}},
		function(err, rsp, body){}
	);
});
