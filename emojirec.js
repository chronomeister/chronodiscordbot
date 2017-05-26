var exports = module.exports = {};
var sq3 = require('sqlite3');
var db = new sq3.Database('./emojis');
const fs = require('fs');
db.run("CREATE TABLE IF NOT EXISTS emojilog(msgid INT, userid INT, chanid INT, guildid INT, emojiid INT, ts INT);");

exports.logemoji = function(msgid, userid, chanid, guildid, emojiid, ts) {
    //console.dir([msgid, userid, guildid, chanid, emojiid, ts]);
    db.run(`INSERT INTO emojilog(msgid, userid, chanid, guildid, emojiid, ts)
              SELECT a.msgid, a.userid, a.chanid, a.guildid, a.emojiid, a.ts
              FROM (SELECT ? "msgid", ? "userid", ? "chanid", ? "guildid", ? "emojiid", CAST(? AS INT) / 1000 "ts") a
              LEFT JOIN emojilog e
                ON a.msgid = e.msgid AND a.userid = e.userid AND a.chanid = e.chanid AND a.guildid = e.guildid AND a.emojiid = e.emojiid AND a.ts = e.ts
              WHERE e.ts IS NULL`
          , [msgid, userid, chanid, guildid, emojiid, ts]);
};
exports.checkusage = function(msg, guildid) {
    //console.dir([msgid, userid, guildid, chanid, emojiid, ts]);
    guildid =  guildid ? guildid : msg.guild.id;
    if (guildid != msg.guild.id) {
        var html = '<html><head><style>img{max-width:32px;max-height:32px;}</style></head><body><table border="1" frame="border" cellspacing="0"><tr><td>emoji</td><td>count</td></tr>';
        db.each(`SELECT CAST(emojiid AS TEXT) "emojiid", count(msgid) "cnt" FROM emojilog WHERE guildid = ? GROUP BY emojiid ORDER BY count(msgid) DESC`, [guildid], function(err, row){
            html += `<tr><td><img src="https://cdn.discordapp.com/emojis/${row.emojiid}.png"></img></td><td>${row.cnt}</td></tr>`;
        }, function(){
            html += "</table></body></html>";
            sendmsg(msg, html);
        });
    } else {
        var html = '<html><head><style>img{max-width:32px;max-height:32px;}</style></head><body><table border="1" frame="border" cellspacing="0"><tr><td>emoji</td><td>count</td><td>most used</td><td>times</td></tr>';
        var users = new Map();
        msg.guild.members.array().forEach(function(mem){
            users.set(mem.user.id, {name : mem.user.username, av : mem.user.avatar});
        });
        db.each(`SELECT CAST(emojiid AS TEXT) "emojiid", CAST(cnt AS TEXT) "cnt", CAST(userid AS TEXT) "userid", max FROM (SELECT CAST(emojiid AS TEXT) "emojiid", CAST(guildid AS TEXT) "guildid", count(msgid) "cnt" FROM emojilog GROUP BY emojiid, guildid ORDER BY count(msgid) DESC) a JOIN (SELECT emojiid, guildid, userid, max(msgs) "max" FROM (SELECT emojiid, userid, guildid, count(msgid) "msgs" FROM emojilog GROUP BY emojiid, userid, guildid ORDER BY count(msgid) DESC) a GROUP BY emojiid, guildid) b USING (emojiid, guildid) WHERE guildid = ? GROUP BY emojiid ORDER BY cnt DESC`, [guildid], function(err, row){
            // console.dir(users);
            // console.dir(row);
            var usr = users.get(row.userid) ? users.get(row.userid) : undefined;
            var img = usr ? `<img src="https://cdn.discordapp.com/avatars/93389633261416448/${usr.av}.png" title="${usr.name}"></img>` : "undefined";
            // console.dir(`<tr><td><img src="https://cdn.discordapp.com/emojis/${row.emojiid}.png"></img></td><td>${row.cnt}</td><td>${img}</td><td>${row.max}</td></tr>`);
            html += `<tr><td><img src="https://cdn.discordapp.com/emojis/${row.emojiid}.png"></img></td><td>${row.cnt}</td><td>${img}</td><td>${row.max}</td></tr>`;
        }, function(){
            html += "</table></body></html>";
            sendmsg(msg, html);
        });
    }
};
var sendmsg = function(msg, html) {
    fs.writeFileSync("./emojiusage.html", html);
    msg.channel.send({file : "./emojiusage.html"}).then(function(){fs.unlink("./emojiusage.html");});
}
// CREATE TABLE tmpemojilog AS SELECT msgid, userid, guildid "chanid", chanid "guildid", emojiid, ts FROM emojilog;DROP TABLE emojilog; ALTER TABLE tmpemojilog RENAME TO emojilog;
