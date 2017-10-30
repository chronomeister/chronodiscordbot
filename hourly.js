var hours = [
    {"id":"57","name":"Ooi"},
    {"id":"58","name":"Kitakami"},
    {"id":"73","name":"Mogami"},
    {"id":"110","name":"Shoukaku"},
    {"id":"111","name":"Zuikaku"},
    {"id":"113","name":"Kinu"},
    {"id":"114","name":"Abukuma"},
    {"id":"115","name":"Yuubari"},
    {"id":"116","name":"Zuihou"},
    {"id":"120","name":"Mikuma"},
    {"id":"122","name":"Maikaze"},
    {"id":"123","name":"Kinugasa"},
    {"id":"124","name":"Suzuya"},
    {"id":"125","name":"Kumano"},
    {"id":"131","name":"Yamato"},
    {"id":"132","name":"Akigumo"},
    {"id":"133","name":"Yuugumo"},
    {"id":"134","name":"Makigumo"},
    {"id":"135","name":"Naganami"},
    {"id":"137","name":"Agano"},
    {"id":"138","name":"Noshiro"},
    {"id":"139","name":"Yahagi"},
    {"id":"140","name":"Sakawa"},
    {"id":"143","name":"Musashi"},
    {"id":"145","name":"Shigure"},
    {"id":"149","name":"Kongou"},
    {"id":"150","name":"Hiei"},
    {"id":"151","name":"Haruna"},
    {"id":"152","name":"Kirishima"},
    {"id":"153","name":"Taihou"},
    {"id":"158","name":"Sendai"},
    {"id":"159","name":"Jintsuu"},
    {"id":"160","name":"Naka"},
    {"id":"161","name":"Akitsumaru"},
    {"id":"163","name":"Maruyu"},
    {"id":"172","name":"Bismarck"},
    {"id":"177","name":"Prinz Eugen"},
    {"id":"187","name":"Akashi"},
    {"id":"107","name":"Chiyoda"},
    {"id":"185","name":"Ryuuhou"},
    {"id":"190","name":"Hatsukaze"},
    {"id":"195","name":"Ayanami"},
    {"id":"201","name":"Fubuki"},
    {"id":"205","name":"Murakumo"},
    {"id":"220","name":"Yura"},
    {"id":"234","name":"Akatsuki"},
    {"id":"265","name":"Myoukou"},
    {"id":"267","name":"Ashigara"},
    {"id":"275","name":"Nagato"},
    {"id":"278","name":"Kaga"},
    {"id":"279","name":"Souryuu"},
    {"id":"280","name":"Hiryuu"},
    {"id":"310","name":"Z1"},
    {"id":"311","name":"Z3"},
    {"id":"316","name":"Amatsukaze"},
    {"id":"320","name":"Isokaze"},
    {"id":"321","name":"Ooyodo"},
    {"id":"322","name":"Tokitsukaze"},
    {"id":"323","name":"Harusame"},
    {"id":"324","name":"Hayashimo"},
    {"id":"325","name":"Kiyoshimo"},
    {"id":"327","name":"Asagumo"},
    {"id":"328","name":"Yamagumo"},
    {"id":"329","name":"Nowaki"},
    {"id":"330","name":"Akizuki"},
    {"id":"343","name":"Katori"},
    {"id":"345","name":"Takanami"},
    {"id":"346","name":"Teruzuki"},
    {"id":"347","name":"Libeccio"},
    {"id":"348","name":"Mizuho"},
    {"id":"350","name":"Umikaze"},
    {"id":"351","name":"Kawakaze"},
    {"id":"352","name":"Hayasui"},
    {"id":"353","name":"Graf Zeppelin"},
    {"id":"354","name":"Arashi"},
    {"id":"355","name":"Hagikaze"},
    {"id":"356","name":"Kashima"},
    {"id":"357","name":"Hatsuzuki"},
    {"id":"358","name":"Zara"},
    {"id":"359","name":"Okinami"},
    {"id":"360","name":"Iowa"},
    {"id":"361","name":"Pola"},
    {"id":"362","name":"Oyashio"},
    {"id":"363","name":"Harukaze"},
    {"id":"364","name":"Warspite"},
    {"id":"365","name":"Aquila"},
    {"id":"366","name":"Minazuki"},
    {"id":"368","name":"Uranami"},
    {"id":"191","name":"Iku"},
    {"id":"367","name":"Nimu"},
    {"id":"406","name":"Unryuu"},
    {"id":"429","name":"Amagi"},
    {"id":"430","name":"Katsuragi"},
    {"id":"447","name":"Roma"},
    {"id":"450","name":"Akitsushima"},
    {"id":"476","name":"Kamikaze"},
    {"id":"106","name":"Chitose"},
    {"id":"436","name":"Ro 500"},
    {"id":"446","name":"Italia"},
    {"id":"370","name":"Asakaze"},
    {"id":"438","name":"Saratoga"},
    {"id":"369","name":"Yamakaze"},
    {"id":"372","name":"Commandant Teste"},
    {"id":"147","name":"Hibiki"},
    {"id":"126","name":"Imuya"},
    {"id":"127","name":"Goya"},
    {"id":"128","name":"Hacchan"},
    {"id":"155","name":"Shioi"},
    {"id":"349","name":"Kazagumo"},
    {"id":"371","name":"Matsukaze"},
    {"id":"374","name":"Hitomi"},
    {"id":"375","name":"Iyo"},
    {"id":"526","name":"Taiyou"},
    {"id":"512","name":"Oktyabrskaya Revolyutsiya"},
    {"id":"499","name":"Kamoi"},
    {"id":"387","name":"Hatakaze"},
    {"id":"390","name":"Amagiri"},
    {"id":"391","name":"Sagiri"},
    {"id":"392","name":"Richelieu"},
    {"id":"393","name":"Ark Royal"},
    {"id":"605","name":"Luigi Torelli"}
];

var request = require('request');
var dayrng = require('random-seed');
var configs = require('./cbotconfig.json');
var tls = require('./quotestl.json');

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
	//configs.webhooks.gct.kc,
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
