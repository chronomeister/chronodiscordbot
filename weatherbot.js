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
    var disid;
    console.dir(msg.author);
    db.get("SELECT disid FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row){disid = row ? row.disid : undefined;});
    if (cmd && disid) { // parameters and user present
        switch (cmd) {
            case "register":
                // if not add/update
                db.run("INSERT OR REPLACE INTO weatherusers(disid, location) VALUES (?,?)", [disid, params.join(" ")]);
                msg.channel.sendMessage("Your location is now registered to " + params.join(" "));
                // check if valid location??
                break;
            case "useMetric":
                if (disid) {
                    db.run("UPDATE weatherusers SET usemetric = !usemetric WHERE disid =?", [disid]);
                    db.get("SELECT usemetric FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row) {
                        msg.channel.sendMessage("You are now using " + (row.useMetric ? "Metric" : "Imperial"));
                    });
                }
                // change metric
                break;
            case "dispLoc":
                if (disid) {
                    db.run("UPDATE weatherusers SET disploc = !disploc WHERE disid =?", [disid]);
                    db.get("SELECT disploc FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row) {
                        msg.channel.sendMessage("I will now " + (row.disploc ? "start" : "stop") + " showing your location on weather requests.");
                    });
                }
                // change metric
                break;
            default:
                msg.channel.sendMessage("Could not find user/command. Please either check the command or register");
                // get weather
        }
    } else if (disid) { // bare word. check if user present, if not return.
        var loc, disp;
        db.get("SELECT location, disploc FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row){
            loc = row ? row.location : undefined;
            disp = row ? row.disploc : undefined;
        });
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
    } else { // tell he is not present
        var loc;
        db.get("SELECT location FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row){disid = row.disid;});
    }
}

function printWeather(msg, weaobj) {

    msg.channel.sendMessage("The weather for " + curweath.current_observation.display_location.full + " is:");
}
