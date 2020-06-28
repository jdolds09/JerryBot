// Stop command
module.exports = {
	name: 'stop',
	description: 'Stop all songs in the queue!',
	execute(message) {
		// Get queue
		const serverQueue = message.client.queue.get(message.guild.id);
		
		// Must be in a voice channel to stop songs
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');

		// Clear all songs in queue and leave voice channel
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};