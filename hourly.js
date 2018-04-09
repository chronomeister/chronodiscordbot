//SELECT en, c.api_id, api_yomi, c.api_name, b.api_name, c.api_voicef, b.api_voicef FROM jsonb_to_recordset((SELECT start2->'api_data'->'api_mst_ship' FROM kcjson ORDER BY apidate DESC LIMIT 1)) c(api_id INT, api_name TEXT, api_yomi TEXT, api_voicef INT) LEFT JOIN jsonb_to_recordset((SELECT start2->'api_data'->'api_mst_ship' FROM kcjson ORDER BY apidate DESC LIMIT 1)) b(api_id INT, api_name TEXT, api_voicef INT, api_aftershipid INT) ON (c.api_id = b.api_aftershipid) LEFT JOIN jptoenships tl ON (c.api_id = tl.api_id) WHERE c.api_voicef >= 3 AND (b.api_voicef < 3 OR b.api_voicef IS NULL)
var lines = require('./hourly.json');

var request = require('request');
var dayrng = require('random-seed');
var configs = require('./cbotconfig.json');
var tls = require('./quotestl.json');
var bdays = require('./shiplaunchdates.json');

var hours = lines.hours;
var t = new Date;
t.setTime(t.getTime()+9*60*60*1000); // can now assume UTC is jp time
var dtstr = new Date(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate());
var rndgen = dayrng(dtstr);

var hr = "0" + t.getUTCHours();
var tkey = "H" + hr.slice(hr.length-2) + "00";
// console.dir(rndgen.random());process.exit();
var rnd = Math.floor(rndgen.random()*hours.length);
var line;
while(!line) {
	rnd = Math.floor(rndgen.random()*hours.length);
	line = tls[hours[rnd]["id"]][tkey];
}
// https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/ships/183.png
// "https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA"
//
// console.log(hours[rnd]["name"]);
// console.log(tl[hours[rnd]["id"]][tkey]);
var webhooks = [
	// configs.webhooks.gct.kc,
	configs.webhooks.ctbpg.wht
];
webhooks.forEach(function(uri){
	request.post({url:uri,
		form: {
			username: `${hours[rnd]["name"]}`,
			content:`${tls[hours[rnd]["id"]][tkey]}`,
			avatar_url:`https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/ships/${hours[rnd]["id"]}.png`
		}},
		function(err, rsp, body){}
	);
});
