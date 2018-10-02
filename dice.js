var exports = module.exports = {};
exports.roll = function(msg, params) {
	let dregex = /^\d+d\d+$/;
	if (params[0] && params[0].match(dregex)) {
		let [num, max] = params[0].split('d');
		let vals = Array(num * 1).fill(0);
		vals = vals.map(()=>{return Math.ceil(Math.random() * max)});
		msg.channel.send(vals.map((i)=>{return '`' + i + '`'}).join(' '));
	} else {
		msg.channel.send('Incorrect format. Format: {num dice}d{max num}');
	}
}
