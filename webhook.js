//var exports = module.exports = {};

var auth = require('./cbotconfig.json');
const fs = require('fs');
var Twitter = require('twitter');
var request = require('request');
var client = new Twitter({
  consumer_key: auth.twitterkey,
  consumer_secret: auth.twittersecret,
  bearer_token: auth.twitterbtoken
});
var namemap = require('./1HDnames.json');
var whconfig = require('./webhookconfig.json');

var lastseenid = {};
whconfig.forEach(function(user){
    user.lastseenid = "";
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
function getStatus(first) {
    whconfig.forEach(function(user){
        // console.log(user);
        if (first) {
            client.get('statuses/user_timeline', {screen_name : user.screen_name}, function(error, tweets, response) {
                // console.log(JSON.parse(response.body));
                user.lastseenid = JSON.parse(response.body)[0].id_str;
                // console.dir(user);
            });
        } else {
            client.get('statuses/user_timeline', {screen_name : user.screen_name, since_id : user.lastseenid}, function(error, tweets, response) {
                // fs.writeFile('./twitter.txt', response.body, function(){}); return;
                var tweets = JSON.parse(response.body);
                var ids = tweets.map(function(status){
                    return status.id_str;
                });
                // console.log(user.screen_name + " : " + user.lastseenid);
                user.lastseenid = tweets[0] ? tweets[0].id_str : user.lastseenid;
                while (tweets.length > 0) {
                    var newtweet = tweets.pop();
                    var newtweetid = newtweet.id_str;
                    // console.log(newtweetid);
                    // request.post({url:'https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA',
                    user.webhooks.forEach(function(url){
                        request.post({url:url,
                            form: {
                                content:`https://twitter.com/${user.screen_name}/status/${newtweetid}`
                            }},
                            function(err, rsp, body){
                                if (user.screen_name == "kancolle_1draw") {
                                    var match = (newtweet.text.match(/お題は ([^\r\n]+) .なります/));
                                    if (!match) return;
                                    var names = match[1].trim().split(/ /)
                                    // console.dir(names);
                                    var enlist = [];
                                    names.forEach(function(name){
                                        if (namemap[name]) enlist.push(namemap[name]);
                                    });
                                    if (enlist[2]) enlist[2] = "and " + enlist[2];
                                    var tl = "Looks like today's 1HD is " + enlist.join(", ") + (enlist.length == 3 ? "" : (enlist.length == 0 ? "" : ", and ") + 3 - enlist.length + " ship" + (enlist.length == 2 ? "" : "s") + " I can't identify");
                                    request.post({url:url,
                                        form: {
                                            content:tl
                                        }},
                                        function(err, rsp, body){});
                                }
                            }
                        );
                    });
                }
            });
        }
    });
}
getStatus(1);

// setTimeout(getStatus, 1000);
setInterval(getStatus, 1500 * 1000 * (whconfig.length + 1) / (15 * 60));

// client.stream('site', {follow: '448311788'}, function(stream) {
//   stream.on('data', function(event) {
//     console.log(event && event.text);
//   });
//
//   stream.on('error', function(error) {
//     throw error;
//   });
// });
