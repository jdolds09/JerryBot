// Now playing command
module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is playing.',
	execute(message) {
		// Get queue of songs, song at subscript 0 is currently playing
		const serverQueue = message.client.queue.get(message.guild.id);
		// Queue of songs doesn't exist
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		// Output current song
		return message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
	},
};