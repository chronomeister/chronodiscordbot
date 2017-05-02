//var exports = module.exports = {};

var auth = require('./cbotconfig.json');
// const fs = require('fs');
var Twitter = require('twitter');

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
        console.dir(ids);  // Raw response object.
        if (first) {ids.forEach(function(id_str){seenidstr.push(id_str)}); return;}
        var newids = [];
        for (var i = 0; i < ids.lenth; i++) {
            if (!seenidstr.includes(ids[i])) {
                newids.push(ids[i]);
            }
        }
        while (newids.length > 0) {
            var newtweetid = newids.pop();
            request.post({url:'https://discordapp.com/api/webhooks/304453640138260481/smTg_XBiNvPHzaSQk0TUOvhAMYpxFxa5L3JOxOTlrxeU4A71SJfxTeyYv7_Y0W-F2DWA',
                form: {
                    content:'http://twitter.com/KanColle_STAFF/status/' + newtweetid
                }},
                function(err, rsp, body){console.dir(rsp);console.dir(err);console.dir(body);}
            );
        }
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
