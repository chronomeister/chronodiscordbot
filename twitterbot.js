var Discord = require("discord.js");
var configs = require('./twitterbot.json');
var bot = new Discord.Client();
const fs = require('fs');
const util = require('util');

bot.on("message", msg => {
}
bot.on('ready', () => {
	console.log('I am ready!');
}
bot.login(configs.discordkey);
