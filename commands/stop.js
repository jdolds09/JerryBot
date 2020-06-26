module.exports = {
	name: 'stop',
	description: 'Stop all songs in the queue!',
	execute(message) {
		var servers = {};
		server = servers[message.guild.id];
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music dumbass.');
		server.songs = [];
		server.connection.end();
	},
};