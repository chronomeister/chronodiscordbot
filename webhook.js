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
                // console.log(user);
                user.lastseenid = ids[0] ? ids[0] : user.lastseenid;
                while (ids.length > 0) {
                    var newtweetid = ids.pop();
                    // request.post({url:'https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA',
                    user.webhooks.forEach(function(url){
                        request.post({url:url,
                            form: {
                                content:`https://twitter.com/${user.screen_name}/status/${newtweetid}`
                            }},
                            function(err, rsp, body){}
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
