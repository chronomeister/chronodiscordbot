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
    var html = '<html><head><style>img{max-width:32px;max-height:32px;}</style></head><body><table border="1" frame="border" cellspacing="0"><tr><td>emoji</td><td>count</td></tr>';
    guildid =  guildid ? guildid : msg.guild.id;
    db.each(`SELECT CAST(emojiid AS TEXT) "emojiid", count(msgid) "cnt" FROM emojilog WHERE guildid = ? GROUP BY emojiid ORDER BY count(msgid) DESC`, [guildid], function(err, row){
        html += `<tr><td><img src="https://cdn.discordapp.com/emojis/${row.emojiid}.png"></img></td><td>${row.cnt}</td></tr>`;
    }, function(){
        html += "</table></body></html>";
        fs.writeFileSync("./emojiusage.html", html);
        msg.channel.send({file : "./emojiusage.html"}).then(function(){fs.unlink("./emojiusage.html");});
    });

};
// CREATE TABLE tmpemojilog AS SELECT msgid, userid, guildid "chanid", chanid "guildid", emojiid, ts FROM emojilog;DROP TABLE emojilog; ALTER TABLE tmpemojilog RENAME TO emojilog;
