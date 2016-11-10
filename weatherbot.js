var exports = module.exports = {};
var request = require('request');
var sq3 = require('sqlite3');
var db = new sq3.Database('./chronodb');

db.run("CREATE TABLE IF NOT EXISTS weatherusers(disid INT, location TEXT, usemetric BOOLEAN DEFAULT TRUE, disploc BOOLEAN DEFAULT TRUE)");
db.run("CREATE TABLE IF NOT EXISTS weathertxttoemoji(wutxt TEXT, disemoji TEXT);");

exports.getWeather = function(msg, params) {
    var cmd = params.shift();
    var useImp = (cmd === "I");
    cmd = useImp ? params.shift() : cmd;
    if (cmd) { // parameters present
        switch (cmd) {
            // check if user exists
            case "register":
                // if not add
                break;
            case "useMetric":
                // change metric
                break;
            case "dispLoc":
                // toggle disploc
                break;
            default:
                // get weather
        }
    } else { // bare word. check if user present, if not return.

    }
    msg.channel.sendMessage("Getting weather for: you");
    var wuurl = "http://api.wunderground.com/api/6a53a8043eb7b05b/geolookup/conditions/forecast/q/61081.json"

    request(wuurl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var curweath = JSON.parse(response.body);
            printWeather(msg, curweath);
            console.dir(curweath);
            // msg.channel.sendMessage(dbhost + idol.file_url);
        }
    });
}

function printWeather(msg, weaobj) {

    msg.channel.sendMessage("The weather for " + curweath.current_observation.display_location.full + " is:");
}
