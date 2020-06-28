// Skip command
module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	execute(message) {
		// Get queue
		const serverQueue = message.client.queue.get(message.guild.id);
		// Must be in voice channel to skip song
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
		// Unable to skip song
		if (!serverQueue) return message.channel.send('There is no song that I could skip!');
		// Skip song
		serverQueue.connection.dispatcher.end();
	},
};