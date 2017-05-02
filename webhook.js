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

var username = ["KanColle_STAFF","KCIconWatcher"];

var lastseenid = {};
username.forEach(function(user){
    lastseenid[user] = "";
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
function getStatus(first) {
    username.forEach(function(user){
        if (first) {
            client.get('statuses/user_timeline', {screen_name : user}, function(error, tweets, response) {
                // console.log(JSON.parse(response.body)[0].id_str);
                lastseenid[user] = JSON.parse(response.body)[0].id_str;
                // console.dir(lastseenid);
            });
        } else {
            client.get('statuses/user_timeline', {screen_name : user, since_id : lastseenid[user]}, function(error, tweets, response) {
                fs.writeFile('./twitter.txt', response.body, function(){}); return;
                var tweets = JSON.parse(response.body);
                var ids = tweets.map(function(status){
                    return status.id_str;
                });
                lastseenid[user] = ids[0] ? ids[0] : lastseenid[user];
                while (ids.length > 0) {
                    console.log(ids[0]);
                    var newtweetid = newids.pop();
                    // request.post({url:'https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA',
                    request.post({url:'https://discordapp.com/api/webhooks/303917161221586957/eQp2qhFeqtWe3PsRe_qFdJpVD9_5oB2ZTJpYvgZmAMKEox1coVsU3JEuxwaeCXE56Kb4',
                        form: {
                            content:`http://twitter.com/${username}/status/${newtweetid}`
                        }},
                        function(err, rsp, body){}
                    );
                }
            });
        }
    });

    return;
}
getStatus(1);

// setTimeout(getStatus, 1000);
setInterval(getStatus, 5000);

// client.stream('site', {follow: '448311788'}, function(stream) {
//   stream.on('data', function(event) {
//     console.log(event && event.text);
//   });
//
//   stream.on('error', function(error) {
//     throw error;
//   });
// });
