const fs = require('fs');
var Discord = require("discord.js");
var configs = require('./webhookconfig.json');
var bot = new Discord.Client();
bot.login(configs.selftoken);

const postobj = require('./sorrymasen.json');

function post(obj) {
	return bot.guilds.get(obj.guild).channels.get(obj.channel).send((process.argv[2] ? `>${process.argv[2]}\n` : "") + `>申し訳ありません`)
	.then(() => {return Promise.resolve()})
	.catch(() => {return Promise.resolve()});
}

bot.on('ready', () => {
	var postprom = postobj.map(obj => {return post(obj)});
	Promise.all(postprom)
	// doserial(postobj, post)
	.then(() => {process.exit();})
	.catch(() => {process.exit();});
});
