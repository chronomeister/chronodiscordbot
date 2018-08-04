var Discord = require("discord.js");
var exports = module.exports = {};
var request = require('request-promise-native');
var fs = require('fs');
var STATUSENUM = Object.freeze({"FINISHED":"Finished", "RELEASING":"Currenly Airing", "NOT_YET_RELEASED" : "Has Not Aired", "CANCELED": "Canceled"});
var SEASONENUM = Object.freeze({"WINTER":"Winter", "SPRING":"Spring", "SUMMER" : "Summer", "FALL": "Fall"});

// query: here's what to look for in the variable. Media: hey i wanted an anime back, using these variables i defined.

// TO DO: Add timeout to
exports.search = function(msg, params) {
	if (params.length < 1) {
		getUpcoming(msg); return;
	}
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
	((minutes > 0) ? minutes + " minute" + (minutes == 1 ? "" : "s") + " " : "")
	// + ((seconds > 0) ? seconds + " second" + (seconds == 1 ? "" : "s") + " " : "")
	return timestr;
}

function getUpcoming(msg) {
	var dayqry = `
	query ($airing_to: Int, $airing_from: Int) {
		Page {
			airingSchedules (airingAt_lesser: $airing_to, airingAt_greater: $airing_from, sort : TIME) {
				mediaId
				airingAt
				episode
			}
		}
	}
	`;

	var listqry = `
	query ($mediaids: [Int]) {
		Page {
			media (id_in: $mediaids) {
				title {
					romaji
					native
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

	var dto = Math.floor((Date.now() - (9*60*60)) / 1000) + 24 * 60 * 60;
	var dfrom = Math.floor((Date.now() - (9*60*60)) / 1000);

	var dayvar = {
		airing_to: dto,
		airing_from: dfrom,
	};

	var soonoptions = {
		url: 'https://graphql.anilist.co',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query: dayqry,
			variables: dayvar
		})
	};

	request(soonoptions)
		.then(getCurrent)
		.catch(hndError);

	function getCurrent(data) {
		var schd = JSON.parse(data).data.Page.airingSchedules;
		var mediavar = {
			mediaids : schd.map((x) => {
				return x.mediaId;
			})
		};
		
		soonoptions.body = JSON.stringify({
			query: listqry,
			variables: mediavar
		});
		request(soonoptions)
			.then(getlist)
			.catch(hndError);
	}

	function getlist(data) {
		var animes = JSON.parse(data).data.Page.media;
		if (animes[0]) {
			var embed = new Discord.RichEmbed();
			embed.setAuthor("Next 10 anime in next 24hrs", "https://anilist.co/img/logo_al.png", "https://anilist.co/");
			animes = animes.sort((a,b) => {
				return a.nextAiringEpisode.timeUntilAiring < b.nextAiringEpisode.timeUntilAiring ? -1 : (
					a.nextAiringEpisode.timeUntilAiring > b.nextAiringEpisode.timeUntilAiring ? 1 : 0
				)
			});
			animes.splice(10, animes.length - 10);
			animes.map((anime) => {
				embed.addField((anime.title.romaji || anime.title.native || "unknown") + ` episode ${anime.nextAiringEpisode.episode}`,
					`Airs In ` + IntToInterval(anime.nextAiringEpisode.timeUntilAiring),
					false);
			});
			msg.channel.send(embed);
		}
		else {
			msg.channel.send(`No anime airing in the next 24hours. (or something broke, actually something probably broke)`);
		}

	}

	function hndError(data) {
		msg.channel.send(`Something went wrong. API changed or site is down`);
	}
}
