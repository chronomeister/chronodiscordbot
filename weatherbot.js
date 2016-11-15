var exports = module.exports = {};
var request = require('request');
var sq3 = require('sqlite3');
var jsonfile = require('jsonfile');
var configs = require('./cbotconfig.json');
// var configs = jsonfile.readFileSync(configfile);
var db = new sq3.Database('./chronodb');

var switchcmds = ["useMetric"];

db.run("CREATE TABLE IF NOT EXISTS weatherusers(disid INT PRIMARY KEY, loc_coord TEXT, usemetric BOOLEAN);");
db.run("CREATE TABLE IF NOT EXISTS weathertxttoemoji(wutxt TEXT, disemoji TEXT);");

// db.run("DELETE FROM weatherusers");



exports.getWeather = function(msg, params) {
    var cmd = params.shift();
    // console.dir(msg.author.id);
    db.get("SELECT disid FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row){
        var disid = row ? row.disid : undefined;
        // console.dir(disid);
        if (cmd && (cmd === "register" || (disid && switchcmds.includes(cmd)) )) { // parameters and user present. Only do if parameter is not a city
            switch (cmd) {
                case "register":
                    // if not add/update
                    if (params[0]) {
                        var wuurl = "http://api.wunderground.com/api/" + configs.wukey + "/geolookup/q/" + params.join("_") + ".json";
                        request(wuurl, function (error, response, html) {
                            if (!error && response.statusCode == 200) {
                                var wuloc = JSON.parse(response.body);
                                if (wuloc.response.error) {msg.channel.sendMessage(wuloc.response.error.type === 'querynotfound' ? "Error: couldn't find city location. Please type a valid location." : "Error locking in your location; try again in one minute"); console.dir(wuloc);return;}
                                db.run("INSERT OR REPLACE INTO weatherusers(disid, loc_coord, usemetric) VALUES (?,?,?)", [msg.author.id, wuloc.location.lat + "," + wuloc.location.lon, (wuloc.location.country === "US" ? 0 : 1)]);
                                msg.channel.sendMessage("Your location is now registered to " + params.join(" "));
                            }
                        });
                    } else {
                        msg.channel.sendMessage("Please specify a location");
                    }
                    // check if valid location??
                    break;
                case "useMetric":
                    if (disid) {
                        db.run("UPDATE weatherusers SET usemetric = NOT usemetric WHERE disid = ?", [disid]);
                        db.get("SELECT usemetric FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row) {
                            msg.channel.sendMessage("You are now using " + (row.useMetric == 1 ? "Metric" : "Imperial"));
                        });
                    }
                    // change metric
                    break;
                case "dispLoc":
                    if (disid) {
                        db.run("UPDATE weatherusers SET disploc = NOT disploc WHERE disid = ?", [disid]);
                        db.get("SELECT disploc FROM weatherusers WHERE disid = ?", [msg.author.id], function(err, row) {
                            // console.dir(row.disploc);
                            msg.channel.sendMessage("I will now " + (row.disploc ? "start" : "stop") + " showing your location on weather requests.");
                        });
                    }
                    else {
                        params.unshift(cmd);
                        msg.channel.sendMessage("Your location is now registered to " + params.join(" "));
                    }
                    break;
                default:
            }
        } else if (cmd && !switchcmds.includes(cmd)) { // city present
            var wobj = {};
            params.unshift(cmd);
            wobj.location = params.join("_");
            // if wobj.metric is undef, base it off country.
            callWeather(msg, wobj);
        } else if (disid) { // bare word. check if user present, if not return.
            db.get("SELECT loc_coord, usemetric FROM weatherusers WHERE disid = ?", [disid], function(err, row){
                var wobj = {};
                wobj.location = row.loc_coord;
                wobj.metric = row.usemetric;
                callWeather(msg, wobj);
            });
        } else { // tell he is not present
            msg.channel.sendMessage("Could not find your location. Please register your location or input a location.");
        }
    });
}

function callWeather(msg, wobj) {
    var wuurl = "http://api.wunderground.com/api/" + configs.wukey + "/conditions/forecast/q/" + wobj.location + ".json";
    // console.log(wuurl);
    request(wuurl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var curweath = JSON.parse(response.body);
            // console.dir(wobj);
            if (curweath.response.error) {msg.channel.sendMessage("Error getting weather; try again in one minute"); console.dir(curweath);return;}
            var isUS = (typeof wobj.metric !== "undefined") ? !wobj.metric : ((curweath.current_observation.display_location.country === "US") ? true : false);
            // console.dir(isUS ? "IMP" : "METRIC");
            var temp = isUS ? curweath.current_observation.temp_f + "F (" + curweath.current_observation.temp_c + "C)" : curweath.current_observation.temp_c + "C (" + curweath.current_observation.temp_f + "F)";
            var wind = isUS ? curweath.current_observation.wind_mph + "mph (" + curweath.current_observation.wind_kph + "kph": curweath.current_observation.wind_kph + "kph (" + curweath.current_observation.wind_mph + "mph";
            var location = (typeof wobj.metric === "undefined") ? curweath.current_observation.display_location.full : msg.author; //just checking if user exists or not
            msg.channel.sendMessage("Current conditions for " + location + ":\n" + curweath.current_observation.weather + " with a temp of " + temp + " and winds out of the " + curweath.current_observation.wind_dir + " at " + wind + ")");
            msg.channel.sendMessage(curweath.forecast.txt_forecast.forecastday[0].title  + "'s forcast for " + location + ":\n" + (isUS ? curweath.forecast.txt_forecast.forecastday[0].fcttext : curweath.forecast.txt_forecast.forecastday[0].fcttext_metric));
            // msg.channel.sendMessage(dbhost + idol.file_url);
        }
    });
}
