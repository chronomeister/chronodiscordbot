var Discord = require("discord.js");
var idolgame = require("./idolbot.js");
var jsonfile = require('jsonfile');
var configfile = './cbotconfig.json';
// var idlemaster = require("./idlemas.js");
var weather = require("./weatherbot.js");

var bot = new Discord.Client();

var configs = jsonfile.readFileSync(configfile);

const TIMEOUT = 2 * 1000;

var timeouts = {};

var prefix = "!";
var commands = new Map([
    ["help", "Displays help for a command. eg \"!help command\""],
    ["idolhell", "This function returns a random idol from a list of idols.\nCurrent list is: Love Live, Idolm\@ster\nCan take one parameter as to add an adjective flair to what idol is returned."],
    ["weather","This function returns the current weather from WeatherUnderground. May use (US) State/City or (US) ZIP code or Country/City or latitute,longitude or airport code. May use letter \"I\" immediately after to get imperial units. eg: \"" + prefix + "weather I 60290\"\nSubcommands:\nregister *location*: register you to a *location*. Used to register you to a location to avoid typing in a location in the future. eg: \"" + prefix + "weather register CA/San_Francisco\" / \"" + prefix + "weather register Japan/Tokyo\"\nuseMetric: toggles the use of metric for your weather. Will return your new setting. eg: \"" + prefix + "weather useMetric\nlocation: toggles the status of displaying your location when using the " + prefix + "weather command. Will return the new status"]
]);

bot.on("message", msg => {
    if(msg.author.bot){
        return;
    }
    // console.dir(msg);
    // idlemaster.addUser(msg.author);
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
                msg.channel.sendMessage("Current commands are: " + cmds.join(", "));
            } else {
                msg.channel.sendMessage("Command not found.");
            }
        } else {
            msg.author.sendMessage(commands.get(cmd));
        }
    }
    else if (command === "idolhell") {

        var lastrun = timeouts.idolhell || 0;
        if (Date.now() - TIMEOUT < lastrun) {return;}
        // command.substr(9);
        if (command.trim().length > 9) {
            msg.channel.sendMessage(msg.author + ", your " + params.join(" ") + " idol is:");
        }
        idolgame.idolhell(msg);
        timeouts.idolhell = Date.now();
    }
    // else if (command.startsWith("score")) {
    //     idlemaster.getScore(msg);
    // }
    else if (command === "weather") {
        weather.getWeather(msg, params);
    }
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login(configs.discordkey);

// setInterval(idlemaster.updateIdle, idlemaster.CHECKINTERVAL);
