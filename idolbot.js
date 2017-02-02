var exports = module.exports = {};
// var jsonfile = require('jsonfile');
var configs = require('./cbotconfig.json');
// var configs = jsonfile.readFileSync(configfile);
var request = require('request');
var idolarys = require('./idols.json');
var dank = [
    "https://s-media-cache-ak0.pinimg.com/236x/47/bf/d7/47bfd75a16c649dc94e0787a0703033c.jpg",
    "http://i.imgur.com/0p5uDxc.jpg",//
    "http://i.imgur.com/wmU51EO.jpg",//
    "http://i.imgur.com/o6x72ve.jpg",
    "http://i.imgur.com/ktd1tsS.jpg",//
    "http://i3.kym-cdn.com/photos/images/original/001/196/119/971.jpg_large",
    "http://i3.kym-cdn.com/photos/images/newsfeed/001/189/588/b08.png",
    "http://i1.kym-cdn.com/photos/images/newsfeed/000/647/309/4cb.png",
    "http://i1.kym-cdn.com/photos/images/newsfeed/001/198/113/7e3.jpg",
    "http://i1.kym-cdn.com/photos/images/newsfeed/001/199/293/a16.png",
    "http://i.imgur.com/znGW4iB.jpg",
    "http://i.imgur.com/znGW4iB.jpg"
];

exports.idolhell = function(msg) {
    var hansolo = 0;
    idolarys.forEach(function(ary){
       hansolo = hansolo + Math.log(ary.length);
    });
    var pull = Math.random() * hansolo;
    var running = 0;
    var list = [];
    idolarys.some(function(ary){
        var odds = Math.log(ary.length);
        var a = running + odds;
        console.log(pull + " : " + a + " : " + Math.log(ary.length) + " : " + hansolo);
        if (pull < running + odds){
            list = ary;
            return true;
        }
        else {
            running = running + odds;
            return false;
        }
    })
    //list = list || ['dio_brando'];
    var name = list[Math.floor(Math.random() * list.length)];
    if (name != "robbie") {
        var parammap = new Map();
        var tagary = [];
        parammap.set("login", "chronomeister");
        parammap.set("api_key", configs.dankey);
        parammap.set("rating", "safe");
        parammap.set("limit", "1");
        tagary.push(name);
        tagary.push("rating:s");
        tagary.push("-comic");
        tagary.push("-6%2Bgirls");
        parammap.set("tags", tagary.join('+'));

        var params = "";
        var first = true;

        for (var key of parammap.keys()) {
           params = params + (first ? "" : "&") + encodeURI(key)+ "=" + parammap.get(key);
           first = false;
        }
        var dbhost = "https://danbooru.donmai.us";
        var dbendpoint = "/posts.json";
        dburl = dbhost + dbendpoint + "?" + params;
        nameformat = name.replace(/_/g, " ").replace(/(\w\S*)/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
        request(dburl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var idol = JSON.parse(response.body)[0];
                msg.channel.sendMessage(nameformat);
                msg.channel.sendMessage(dbhost + idol.file_url);
            }
        });
    } else {
        msg.channel.sendMessage("Robbie Rotten");
        msg.channel.sendMessage(dank[Math.floor(Math.random() * dank.length)]);
    }
}
