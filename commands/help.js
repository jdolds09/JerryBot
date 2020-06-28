const fs = require('fs') // For file parsing

// Help command
module.exports = {
	name: 'help',
	description: 'List all available commands.',
	execute(message) {
		// Output string
		let str = '';
		
		// Get all commands
		const misc_commandFiles = fs.readdirSync('./commands/Misc').filter(file => file.endsWith('.js'));
		const music_commandFiles = fs.readdirSync('./commands/Music').filter(file => file.endsWith('.js'));
		const nsfw_commandFiles = fs.readdirSync('./commands/NSFW').filter(file => file.endsWith('.js'));
		const fun_commandFiles = fs.readdirSync('./commands/Fun').filter(file => file.endsWith('.js'));

		// Add all miscellaneous commands to output string
		for (const file of misc_commandFiles) {
			const command = require(`./Misc/${file}`);
			str += `__**!${command.name}**__: ${command.description} \n`;
		}

		// Add all music commands to output string
		for (const file of music_commandFiles) {
			const command = require(`./Music/${file}`);
			if(command.name === "play")
				str += `__**!${command.name} [youtube link]**__: ${command.description} \n`;
			else
				str += `__**!${command.name}**__: ${command.description} \n`;
		}

		// Add all NSFW commands to output string
		for (const file of nsfw_commandFiles) {
			const command = require(`./NSFW/${file}`);
			str += `__**!${command.name}**__: ${command.description} \n`;
		}

		// Add all fun commands to output string
		for (const file of fun_commandFiles) {
			const command = require(`./Fun/${file}`);
			if(command.name === "roll")
				str += `__**!${command.name} [number]**__: ${command.description} \n`;
			else if(command.name === "hangman")
			str += `__**!${command.name} [letter]**__: ${command.description} \n`;
			else
				str += `__**!${command.name}**__: ${command.description} \n`;
		}

		message.channel.send(str);
	},
};