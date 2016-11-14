var exports = module.exports = {};
var request = require('request');

// map of (users, timeleft)
var idlemap = new Map();

//

var AFKCOUNTDOWN = 15;

exports.CHECKINTERVAL = 5 * 1000;

exports.updateIdle = function() {
    idlemap.forEach(function(value,key,map){
        var newval =  idlemap.get(key) - 1;
        if (newval < 0) {
            idlemap.delete(key);
        } else {
            console.dir(key + " : " + idlemap.get(key));
            idlemap.set(key,newval);
        }
    });
}

exports.addUser = function(author) {
    idlemap.set(author,AFKCOUNTDOWN);
    // console.dir(author);
}

exports.getScore = function(msg) {
    msg.channel.sendMessage(msg.author + " has " + idlemap.get(msg.author) + " points");
    // console.dir(author);
}
