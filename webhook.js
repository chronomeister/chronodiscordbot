//var exports = module.exports = {};

var auth = require('./cbotconfig.json');
// const fs = require('fs');
var Twitter = require('twitter');
var request = require('request');
var client = new Twitter({
  consumer_key: auth.twitterkey,
  consumer_secret: auth.twittersecret,
  bearer_token: auth.twitterbtoken
});

var username = "KanColle_STAFF";

var seenidstr = [];
/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
function getStatus(first) {
    client.get('statuses/user_timeline', {screen_name: username}, function(error, tweets, response) {
        // console.log(tweets);  // The favorites.
        var tweets = JSON.parse(response.body);
        var ids = tweets.map(function(status){
            return status.id_str;
        });
        // fs.writeFile('./twitter.txt', response.body, function(){});
        // console.log("new");
        if (first) {seenidstr = ids; return;}
        // console.dir(ids);  // Raw response object.
        // console.dir(seenidstr);
        var newids = [];
        for (var i = 0; i < ids.length; i++) {
            if (!seenidstr.includes(ids[i])) {
                newids.push(ids[i]);
                // console.log(ids[i]);
            }
        }
        while (newids.length > 0) {
            var newtweetid = newids.pop();
            request.post({url:'https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA',
                form: {
                    content:`http://twitter.com/${username}/status/${newtweetid}`
                }},
                function(err, rsp, body){}
            );
        }
        seenidstr = ids;
    });
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
