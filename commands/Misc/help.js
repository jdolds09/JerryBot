const fs = require('fs')

module.exports = {
	name: 'help',
	description: 'List all available commands.',
	execute(message) {
        let str = '';
		const misc_commandFiles = fs.readdirSync('../commands/Misc').filter(file => file.endsWith('.js'));
		const music_commandFiles = fs.readdirSync('../commands/Music').filter(file => file.endsWith('.js'));
		const nsfw_commandFiles = fs.readdirSync('../commands/NSFW').filter(file => file.endsWith('.js'));

		for (const file of misc_commandFiles) {
			const command = require(`./${file}`);
			str += `${command.name}: ${command.description} \n`;
		}

		for (const file of music_commandFiles) {
			const command = require(`../commands/Music/${file}`);
			str += `${command.name}: ${command.description} \n`;
		}

		for (const file of nsfw_commandFiles) {
			const command = require(`../commands/NSFW/${file}`);
			str += `${command.name}: ${command.description} \n`;
		}

		message.channel.send(str);
	},
};