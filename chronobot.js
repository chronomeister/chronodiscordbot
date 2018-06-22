var Discord = require("discord.js");
var idolgame = require("./idolbot.js");
// var jsonfile = require('jsonfile');
// var configfile = './cbotconfig.json';
var configs = require('./cbotconfig.json');
// var idlemaster = require("./idlemas.js");
var weather = require("./weatherbot.js");
var br = require("./br.js");
var cx = require("./cx.js");
var yt = require("./youtube.js");
var eight = require("./8ball.js");
var choose = require("./choose.js");
var irankpic =  require("./irankpic.js");
var friends =  require("./friends.js");
var cg =  require("./cg.js");
var friendcd =  require("./friendcd.js");
var eurobeat =  require("./eurobeat.js");
var blue =  require("./blue.js");
var elog =  require("./emojirec.js");
var ibday = require("./ibdaywhen.js");
var hummingbird = require("./hummingbird.js");
var anime = require("./anime.js");
// var embed = require("./embed.js");
var bot = new Discord.Client();
const fs = require('fs');
const util = require('util');
const TIMEOUT = 2 * 1000;

var timeouts = {};

var started = false;
var cdid;
var prefix = "!";
var commands = new Map([
	["help", "Yo, I heard you like help so I got you a help in your help so I can help you help."],
	["idolhell", "This function returns a random idol from a list of idols.\nCurrent list is: Love Live, Idolm\@ster\nCan take one parameter as to add an adjective flair to what idol is returned."],
	["weather","This function returns the current weather from WeatherUnderground. May use (US) State/City or (US) ZIP code or Country/City or latitute,longitude or airport code. eg: \"" + prefix + "weather 60290\"\n\nSubcommands:\nregister *location*: register you to a *location*. Used to register you to a location to avoid typing in a location in the future. DM me if you don't want to show off your location. Be aware your location will be stored in a local database the maintainer can read. eg: \"" + prefix + "weather register CA/San_Francisco\" / \"" + prefix + "weather register Tokyo, Japan\"\n\nuseMetric: toggles the use of metric for your weather. Will return your new setting. eg: \"" + prefix + "weather useMetric"], //\nlocation: toggles the status of displaying your location when using the " + prefix + "weather command. Will return the new status.
	["bobross OR br","Returns a random Bob Ross quote. Every day is a good day when you paint. KappaRoss"],
	["cx","Gets the current exchange rate for two currencies. Provide a six character string with the first 3 characters being the from currency and the next 3 characters being the to currency. You may give a number of the first currency to get the value of the second currency.\nYou may use SPK,PUL,JEW for Deresute spark, 10-pull, and jewels respectively"],
	["youtube OR yt","Simple search of youtube. Returns top result."],
	["8ball","Ask the mystical 8ball your question and receive an answer. May or may not be accurate."],
	["choose", "Don't like 8ball's answers? Fine, you can narrow down the repsonses. Provide a list of choices separated by a semicolon (;) and I will pick one from them."],
	["friends", "Because chrono got obsessed with this Kemono Friends show and needs to know the next air time."],
	["cg", "Like friends, but for Cinderella Girls Theater."],
	["eurobeat", "When you need to experience some Deju Vu of Running in the 90's."],
	["stand", "IS THAT A JOJO REFERENCE?!"],
	["jojo", "IT IS A JOJO REFERENCE!"],
	["gitgud", "Is someone sucking? Tell 'em what to do."],
	["thicc OR extrathicc OR et", "When you're Aku and need to order a large."],
	["ibday OR idolbday", "When is the next idol birthday?"],
	["hb OR hummingbird", "Because chrono is obsessed but too lazy to go look up a countdown for a song."],
	["regional", "Send a message with additional cancer of regional indicators."],
	["anime", "Search Anilist for an anime.\nCan set up an alias to an query by: `" + prefix + "anime alias <single word> <word(s) to alias>`\nTo delete an alias: `" + prefix + "anime alias delete <word>`"],
	["salt OR salty", "MAKE ME SALTY, ALL OVER AGAIN"]
]);

var emjregex = /<:[^\r\n:]+:([^\r\n>]+)>/g;
var emojiservers = new Discord.Collection();

bot.on("messageReactionAdd", (reaction, user) => {
	if (emojiservers.get(reaction.emoji.id)) {
		elog.logemoji(reaction.message.id, '', reaction.message.channel.id, reaction.message.channel.guild.id, reaction.emoji.id, reaction.message.createdTimestamp);
	}
});

bot.on("messageUpdate", msg => {
	while ((ematch = emjregex.exec(msg.content)) !== null) {
		if (emojiservers.get(ematch[1])) {
			//msgid, userid, guildid, emojiid, ts
			elog.logemoji(msg.id, msg.author.id, msg.channel.id, msg.channel.guild.id, ematch[1], msg.createdTimestamp);
		}
	}
});

bot.on("message", msg => {
	if(msg.author.bot){
		return;
	}
	var cdchannelid = '239224953172393984';'242663092171964417';

	var ematch;
	while ((ematch = emjregex.exec(msg.content)) !== null) {
		if (emojiservers.get(ematch[1])) {
			//msgid, userid, guildid, emojiid, ts
			elog.logemoji(msg.id, msg.author.id, msg.channel.id, msg.channel.guild.id, ematch[1], msg.createdTimestamp);
			// console.dir([msg.id, msg.author.id, msg.channel.id, msg.channel.guild.id, ematch[1], msg.createdTimestamp]);
		}
	}
	var twitmatch = /`?https?:\/\/twitter.com\/[^/]+\/status\/([\d]+)`?/;
	var twm = msg.content.match(twitmatch);
	if (twm && twm[0] && twm[0][0] !== '`') {
		var Twitter = require('twitter');

		var twitclient = new Twitter({
		  consumer_key: configs.twitterkey,
		  consumer_secret: configs.twittersecret,
		  bearer_token: configs.twitterbtoken
		});

		var twid = twm[1];
		twitclient.get(`statuses/show/${twid}`, {tweet_mode : "extended"}, function(error, tweet, response) {
			function doserial(ary, fn) {
				return ary.reduce(function(p, item) {
					return p.then(function(){
						return fn(item);
					});
				}, Promise.resolve())
			}
			doserial(tweet.extended_entities.media.splice(1, tweet.extended_entities.media.length - 1), writeurl).then();
		});

		function writeurl(tweetimage) {
			return msg.channel.send(tweetimage.media_url_https);
		}
	}
	// msg.channel.send('<@242659286830940160>');
	// idlemaster.addUser(msg.author);
	// var dad = /^i( a|')?m +(([^ ]+ +)?[^ ]+)(\.|!|\?)??$/;
	// if (dad.test(msg.content)) {fs.appendFile('./dad.txt', Date() + ': Dad says "Hi, ' + dad.exec(msg.content)[2] +"\"\n", function(){})}
	if (!msg.content.startsWith(prefix)) return;
	var params = msg.content.substr(1).split(' ');
	var command = params.shift();
	if (command === "help") {
		var cmd = params.shift();
		if (!commands.has(cmd)) {
			// console.dir();
			if (typeof cmd === "undefined") {
				var cmds = [];
				// var iter = commands.keys();
				for(let key of commands.keys()) {cmds.push(prefix + key)};
				// console.dir(cmds);
				msg.channel.send("Current commands are: \n" + cmds.join("\n") + "\n");
				msg.channel.send("For more help on a specific command type: '" + prefix + "help *command*'");
			} else {
				msg.channel.send("Command not found.");
			}
		} else {
			msg.author.send(commands.get(cmd));
		}
	}
	else if (command === "idolhell") {
		if (params.length > 0) {
			msg.channel.send(msg.author + ", your " + params.join(" ") + " idol is:");
		}
		idolgame.idolhell(msg);
	}
	// else if (command.startsWith("score")) {
	//     idlemaster.getScore(msg);
	// }
	else if (command === "weather") {
		weather.getWeather(msg, params);
	}
	else if (command === "bobross" || command === "br") {
		br.bobross(msg);
	}
	else if (command === "cx") {
		cx.currencyexchange(msg, params);
	}
	else if (command === "youtube" || command === "yt") {
		yt.youtube(msg, params);
	}
	else if (command === "8ball") {
		eight.eightball(msg);
	}
	else if (command === "choose") {
		choose.choice(msg, params);
	}
	else if (command == "tier") {
		irankpic.pic(msg);
	}
	else if (command == "friends") {
		friends.time(msg);//.then( id => {
			//if (!started && msg.channel.id === cdchannelid) {
			//    msg.delete();
			//    bot.setInterval(friendcd.updatemsg,3257,id);
			//    started = true;
			//}
			//});
	}
	else if (command == "cg") {
		cg.time(msg).then( id => {
			if (!started && msg.channel.id === cdchannelid) {
				msg.delete();
				bot.setInterval(friendcd.updatemsg,3257,id);
				started = true;
			}
		});
	}
	else if (command == "eurobeat") {
		eurobeat.drift(msg);
	}
	else if (command == "stand") {
		msg.channel.send("ゴ ゴ ゴ ゴ ゴ ゴ ＴＨＩＳ　ＭＵＳＴ　ＢＥ　ＴＨＥ　ＷＯＲＫ　ＯＦ　ＡＮ　ＥＮＥＭＹ　『**ＳＴＡＮＤ**』ゴ ゴ ゴ ゴ ゴ ゴ");
	}
	else if (command == "jojo") {
		msg.channel.send("ＨＯＬＹ　ＳＨＩＴ！　ＩＳ　ＴＨＡＴ　Ａ　ＭＯＴＨＥＲＦＵＣＫＩＮ′　ＪＯＪＯ　ＲＥＦＥＲＥＮＣＥ？");
	}
	else if (command == "jail") {
		msg.channel.send("https://youtu.be/XeDM1ZjMK50");
	}
	else if (command == "seduce" && msg.author.id == 93389633261416448) {
		msg.channel.send("https://youtu.be/3-tH5e-SwDU");
	}
	else if (command == "seduce" || command == "seduceme") {
		msg.channel.send("https://www.youtube.com/watch?v=izGwDsrQ1eQ");
	}
	else if (command == "salt" || command == "salty") {
		msg.channel.send("https://www.youtube.com/watch?v=gfc1MRVmJYs");
	}
	else if (command == "gitgud") {
		msg.channel.send({file:"./gitgud.jpg"});
	}
	else if (command == "toblerone") {
		msg.channel.send({file:"./toblerone.jpg"});
	}
	else if (command == "thicc" || command == "extrathicc" || command == "et") {
		msg.channel.send({file:"./thicc.jpg"});
	}
	else if (command == "ibday" || command == "idolbday") {
		ibday.when(msg, params);
	}
	else if (command == "fff" || command == "funfunfun" || command == "funfare") {
		hummingbird.when(msg);
	}
	else if ((command == "dab" || command == "slap") && msg.mentions.users.size > 0) {
		msg.channel.send(`<@${msg.author.id}> dabs at <@${msg.mentions.users.first().id}>`);
	}
	// else if (command == "test") {
	//     fs.appendFile('./dad.txt', Date() + ': Dad says "Hi, '  +"\"\n", function(){})
	// }
	else if (command == "regional") {
		blue.region(msg, params);
	}
	else if (command == "anime") {
		anime.search(msg, params);
	}
	else if (msg.author.id == 93389633261416448) {
		if (command == "isp") {
			msg.channel.send("https://my.mixtape.moe/gerost.mp3");
		}
		else if (command == "zukin") {
			msg.channel.send({file:"./zukin.png"});
		}
		else if (command == "test") {
			msg.channel.send("hi");
			// fs.writeFile('./dump.txt', util.inspect(msg.mentions.users.first()));
		}
		else if (command == "echeck") {
			elog.checkusage(msg, params[0]);
		}
	}
});

bot.on('ready', () => {
	console.log('I am ready!');
	bot.guilds.forEach(function(val, key, glds){
		val.emojis.forEach(function(ev, ek, emjs){
			emojiservers.set(ek,key);
		});
		//   console.dir(val);
	});
	//console.dir(emojiservers);
});

try {fs.closeSync(fs.openSync('./anime.json', 'r'))} catch(discard) { fs.writeFileSync('./anime.json', '{}')}
bot.login(configs.discordkey);
