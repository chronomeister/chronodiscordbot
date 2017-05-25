var exports = module.exports = {};
//var API_KEY = 'AIzaSyBJBw0kZANiuIDpXyrQx74ko77Do0HkT8g';
var request = require('request');
var configs = require('./cbotconfig.json');

exports.youtube = function(msg, qary) {
    var parammap = new Map();
    // var qary = [];
    parammap.set("key", configs.ytkey);
    // parammap.set('key', API_KEY);
    parammap.set('part', 'id,snippet');
    // qary.push('諸星きらり');
    parammap.set('q', qary.join('+'));
    parammap.set('regionCode', 'jp');
    parammap.set('type', 'video');

    var params = "";
    var first = true;

    for (var key of parammap.keys()) {
       params = params + (first ? "" : "&") + encodeURI(key)+ "=" + encodeURI(parammap.get(key));
       first = false;
    }

    var ythost = "https://www.googleapis.com";
    var ytendpoint = "/youtube/v3/search";
    yturl = ythost + ytendpoint + "?" + params;

    request(yturl, function (error, response, html) {

        if (!error && response.statusCode == 200) {
            var ytsearch = JSON.parse(response.body);
            // console.dir(ytsearch.items[0]);
            msg.channel.send('https://youtu.be/' + ytsearch.items[0].id.videoId);
        }
    });
}
