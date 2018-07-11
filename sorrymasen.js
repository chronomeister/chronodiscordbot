const fs = require('fs');
const util = require('util');

function post() {
	var Discord = require("discord.js");
	var configs = require('./webhookconfig.json');
	var bot = new Discord.Client();
	console.log("before log");
	console.log("after log");
	bot.on('disconnect', () => {console.log('dis coneeeeeeect')});
	bot.on('ready', () => {
		// fs.appendFile(`./dump.txt`, util.inspect(bot.guilds, {depth : 3}) + "\n", () => {console.log("done")});
		// console.dir(bot.guilds);
		bot.guilds.get("242663092171964417").channels.get("319221390450360330").send(`"申し訳ありません"`)
		.then(() => {console.log("le ded"); return bot.destory()});
	});
	bot.login(configs.selftoken);
}



post();
