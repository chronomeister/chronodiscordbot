var exports = module.exports = {};
var sq3 = require('sqlite3');
var db = new sq3.Database('./emojis');
db.run("CREATE TABLE IF NOT EXISTS emojilog(msgid INT, userid INT, chanid INT, guildid INT, emojiid INT, ts INT);");

exports.logemoji = function(msgid, userid, chanid, guildid, emojiid, ts) {
    //console.dir([msgid, userid, guildid, chanid, emojiid, ts]);
    db.run(`INSERT INTO emojilog(msgid, userid, chanid, guildid, emojiid, ts)
              SELECT a.msgid, a.userid, a.chanid, a.guildid, a.emojiid, a.ts
              FROM (SELECT ? "msgid", ? "userid", ? "chanid", ? "guildid", ? "emojiid", CAST(? AS INT) / 1000 "ts") a
              LEFT JOIN emojilog e
                ON a.msgid = e.msgid AND a.userid = e.userid AND a.chanid = e.chanid AND a.guildid = e.guildid AND a.emojiid = e.emojiid AND a.ts = e.ts
              WHERE e.ts IS NULL`
          , [msgid, userid, guildid, chanid, emojiid, ts]);
}
