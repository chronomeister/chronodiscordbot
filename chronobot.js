var Discord = require("discord.js");
var idolgame = require("./idolbot.js");
var request = require('request');
var jsonfile = require('jsonfile');
var configfile = './cbotconfig.json';
var idlemaster = require("./idlemas.js");

var configs = jsonfile.readFileSync(configfile);

const TIMEOUT = 2 * 1000;

var timeouts = {};

var bot = new Discord.Client();

bot.on("message", msg => {
    if(msg.author.bot){
        return;
    }
    let prefix = "!";
    // if(msg.content != "!thisisatest") return;
    idlemaster.addUser(msg.author);
    if (!msg.content.startsWith(prefix)) return;
    var command = msg.content.substr(1);
    if (command.startsWith("idolhell")) {
        var lastrun = timeouts.idolhell || 0;
        if (Date.now() - TIMEOUT < lastrun) {return;}
        command.substr(9);
        if (command.trim().length > 9) {
            msg.channel.sendMessage(msg.author + ", your " + command.trim().substr(9) + " idol is:");
        }
        idolgame.idolhell(msg);
        timeouts.idolhell = Date.now();
    }
    if (command.startsWith("score")) {
        idlemaster.getScore(msg);
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(configs.discordkey);

setInterval(idlemaster.updateIdle, idlemaster.CHECKINTERVAL);
