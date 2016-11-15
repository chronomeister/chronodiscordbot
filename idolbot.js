var exports = module.exports = {};
var jsonfile = require('jsonfile');
var configs = require('./cbotconfig.json');
// var configs = jsonfile.readFileSync(configfile);
var request = require('request');
var idolarys = require('./idols.json');


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
        // console.log(pull + " : " + a + " : " + Math.log(ary.length) + " : " + hansolo);
        if (pull < running + odds){
            list = ary;
            return true;
        }
        else {
            running = running + odds;
            return false;
        }
    })
    list = list || ['dio_brando'];
    var name = list[Math.floor(Math.random() * list.length)];
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
}
