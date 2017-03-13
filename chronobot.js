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
var eurobeat =  require("./eurobeat.js");
// var embed = require("./embed.js");
var bot = new Discord.Client();
const fs = require('fs');

// https://statsapi.web.nhl.com/api/v1/schedule?startDate=2017-01-31&endDate=2017-01-31&expand=schedule.teams,schedule.linescore,schedule.broadcasts.all,schedule.ticket,schedule.game.content.media.epg,schedule.radioBroadcasts,schedule.decisions,schedule.scoringplays,schedule.game.content.highlights.scoreboard,team.leaders,schedule.game.seriesSummary,seriesSummary.series&leaderCategories=points,goals,assists&leaderGameTypes=R&site=en_nhl&teamId=&gameType=&timecode=

const TIMEOUT = 2 * 1000;

var timeouts = {};

var prefix = "!";
var commands = new Map([
    ["help", "Yo, I heard you like help so I got you a help in your help so I can help you help."],
    ["idolhell", "This function returns a random idol from a list of idols.\nCurrent list is: Love Live, Idolm\@ster\nCan take one parameter as to add an adjective flair to what idol is returned."],
    ["weather","This function returns the current weather from WeatherUnderground. May use (US) State/City or (US) ZIP code or Country/City or latitute,longitude or airport code. eg: \"" + prefix + "weather 60290\"\n\nSubcommands:\nregister *location*: register you to a *location*. Used to register you to a location to avoid typing in a location in the future. DM me if you don't want to show off your location. Be aware your location will be stored in a local database the maintainer can read. eg: \"" + prefix + "weather register CA/San_Francisco\" / \"" + prefix + "weather register Tokyo, Japan\"\n\nuseMetric: toggles the use of metric for your weather. Will return your new setting. eg: \"" + prefix + "weather useMetric"], //\nlocation: toggles the status of displaying your location when using the " + prefix + "weather command. Will return the new status.
    ["bobross OR br","Returns a random Bob Ross quote. Every day is a good day when you paint. KappaRoss"],
    ["cx","Gets the current exchange rate for two currencies. Provide a six character string with the first 3 characters being the from currency and the next 3 characters being the to currency. You may give a number of the first currency to get the value of the second currency."],
    ["youtube OR yt","Simple search of youtube. Returns top result."],
    ["8ball","Ask the mystical 8ball your question and receive an answer. May or may not be accurate."],
    ["choose", "Don't like 8ball's answers? Fine, you can narrow down the repsonses. Provide a list of choices separated by a semicolon (;) and I will pick one from them."],
    ["friends", "Because chrono got obsessed with this Kemono Friends show and needs to know the next air time."],
    ["isp", "Need someone to blame? Blame your ISP."]
]);

bot.on("message", msg => {
    if(msg.author.bot){
        return;
    }
    // console.dir(msg.author);
    // msg.channel.sendMessage('<@242659286830940160>');
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
                msg.channel.sendMessage("Current commands are: \n" + cmds.join("\n") + "\n");
                msg.channel.sendMessage("For more help on a specific command type: '" + prefix + "help *command*'");
            } else {
                msg.channel.sendMessage("Command not found.");
            }
        } else {
            msg.author.sendMessage(commands.get(cmd));
        }
    }
    else if (command === "idolhell") {
        if (params.length > 0) {
            msg.channel.sendMessage(msg.author + ", your " + params.join(" ") + " idol is:");
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
        friends.time(msg);
    }
    else if (command == "eurobeat") {
        eurobeat.drift(msg);
    }
    // else if (command == "test") {
    //     fs.appendFile('./dad.txt', Date() + ': Dad says "Hi, '  +"\"\n", function(){})
    // }
    else if (msg.author.id == 93389633261416448) {
        if (command == "isp") {
            msg.channel.sendMessage("https://my.mixtape.moe/gerost.mp3");
        }
        else if (command == "zukin") {
            msg.channel.sendMessage('https://i.imgur.com/Tv1EoL6.png');
        }
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(configs.discordkey);

// setInterval(idlemaster.updateIdle, idlemaster.CHECKINTERVAL);
