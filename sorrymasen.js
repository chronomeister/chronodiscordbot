const fs = require('fs');
const util = require('util');
var Discord = require("discord.js");
var configs = require('./webhookconfig.json');
var bot = new Discord.Client();
bot.login(configs.selftoken);

const postobj = [
	{"guild":"457750528345243649","channel":"457751483346190339","note":"GCT"},
	{"guild":"242663092171964417","channel":"319221390450360330","note":"TBP"}
]

function post(obj) {
	return bot.guilds.get(obj.guild).channels.get(obj.channel).send(`"申し訳ありません"`)
	.then(() => {console.log("ret"); return Promise.resolve()})
	.catch(() => {console.log("ret"); return Promise.resolve()});
}

bot.on('ready', () => {
	var postprom = postobj.map(obj => {return post(obj)});
	Promise.all(postprom)
	// doserial(postobj, post)
	.then(() => {console.log("then");process.exit();})
	.catch(() => {console.log("catch");process.exit();});
});
