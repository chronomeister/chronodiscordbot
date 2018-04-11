var Discord = require("discord.js");
var exports = module.exports = {};
var request = require('request-promise-native');
var fs = require('fs');
var STATUSENUM = Object.freeze({"FINISHED":"Finished", "RELEASING":"Currenly Airing", "NOT_YET_RELEASED" : "Has Not Aired", "CANCELED": "Canceled"});
var SEASONENUM = Object.freeze({"WINTER":"Winter", "SPRING":"Spring", "SUMMER" : "Summer", "FALL": "Fall"});

// query: here's what to look for in the variable. Media: hey i wanted an anime back, using these variables i defined.

// TO DO: Add timeout to
exports.search = function(msg, params) {
	if (params.length < 1) {msg.channel.send("Nothing to search for. Maybe sometime in the future I might turn this into a soon to air list"); return;}
	var aliases = require('./anime.json');
	if (params[0] === 'alias') {
		if (params.length < 3) {msg.channel.send("Invalid alias format. Format is as follows: alias <single word> <word(s) to alias>"); return;}
		params.shift(); // getting rid of alias
		var al = params.shift();
		var val = params.join(' ');
		if (!aliases[msg.author.id]) aliases[msg.author.id] = {};
		var sendmsg;
		if (al === 'delete') {
			var delval = params.shift();
			delete aliases[msg.author.id][delval];
			sendmsg = `"${delval}" is no long aliased for you`;
		} else {
			aliases[msg.author.id][al] = val;
			sendmsg = `"${al}" is now aliased to "${val}" for you`;
		}
		fs.writeFile('./anime.json', JSON.stringify(aliases), ()=>{});
		msg.channel.send(sendmsg);
	} else {
		var query = `
		query ($search: String) {
			Page {
				media (search: $search, type: ANIME) {
					title {
						romaji
						native
					}
					episodes
					description
					status
					startDate {
						year
					}
					season
					coverImage {
						medium
					}
					nextAiringEpisode {
						airingAt
						timeUntilAiring
						episode
					}
					siteUrl
				}
			}
		}
		`;
		var al;
		if (aliases[msg.author.id]) {al = aliases[msg.author.id][params.join(" ")];}
		var sq = al || params.join(" ");
		var variables = {
			search: sq
		};

		var options = {
			url: 'https://graphql.anilist.co',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: variables
			})
		};

		request(options)
			.then(handleData)
			.catch(handleError);

		function handleData(data) {
			var animes = JSON.parse(data).data.Page.media;
			if (animes[0]) {
				var anime = animes[0];
				var embed = new Discord.RichEmbed();
				if (anime.description) {embed.setDescription(anime.description.replace(/<br[ /]*>/g, ""));}
				embed.setThumbnail(anime.coverImage.medium);
				embed.setAuthor(`${anime.title.romaji} (${anime.title.native})`, "https://anilist.co/img/logo_al.png", anime.siteUrl);
				embed.addField("Airing Season", (SEASONENUM[anime.season] || "Unknown") + " " + anime.startDate.year, true);
				embed.addField("Episodes", anime.episodes || "Unknown", true);
				embed.addField("Status", STATUSENUM[anime.status] || "Unknown", false);
				if (anime.nextAiringEpisode) {
					embed.addField("Next Air Time", IntToDateStr(anime.nextAiringEpisode.airingAt), true);
					embed.addField(`Episode ${anime.nextAiringEpisode.episode} Airs In`, IntToInterval(anime.nextAiringEpisode.timeUntilAiring), true);
				}
				if (animes.length > 1) {
					embed.setFooter(`Found ${animes.length} matches to "${sq}". Showing only first entry`)
				}
				msg.channel.send(embed);
			}
			else {
				msg.channel.send(`Could not find an anime matching the term: ${sq}`);
			}
		}

		function handleError(error) {
			msg.channel.send(`Something went wrong. API changed or site is down`);
		}
	}
}
function IntToDateStr(time) {
	var a = new Date((time + (9*60*60)) * 1000).toUTCString();
	return a.substr(0, a.length - 7);
}
function IntToInterval(time) {
	var days = Math.floor(Math.floor(Math.floor(Math.floor(time) / 60) / 60) / 24);
	var hours = Math.floor(Math.floor(Math.floor(time) / 60) / 60) % 24;
	var minutes = Math.floor(Math.floor(time) / 60) % 60;
	var seconds = Math.floor(time) % 60;
	var timestr = ((days > 0) ? days + " day" + (days == 1 ? "" : "s") + " " : "") +
	((hours > 0) ? hours + " hour" + (hours == 1 ? "" : "s") + " " : "") +
	((minutes > 0) ? minutes + " minute" + (minutes == 1 ? "" : "s") + " " : "") +
	((seconds > 0) ? seconds + " second" + (seconds == 1 ? "" : "s") + " " : "")
	return timestr;
}
