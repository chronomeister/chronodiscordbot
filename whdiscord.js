const fs = require('fs');
var Discord = require("discord.js");
var configs = require('./webhookconfig.json');
var bot = new Discord.Client();
bot.login(configs.selftoken);

function post(obj) {

	return bot.guilds.get(obj.guild).channels.get(obj.channel).send(`New KC profile image detected! ${process.argv[2]}`)
	.then(() => {return Promise.resolve()})
	.catch(() => {return Promise.resolve()});
}

bot.on('ready', () => {
	var postprom = configs.selfposts.map(obj => {return post(obj)});
	Promise.all(postprom)
	// doserial(postobj, post)
	.then(() => {process.exit();})
	.catch(() => {process.exit();});
});
