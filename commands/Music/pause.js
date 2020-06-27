module.exports = {
	name: 'pause',
	description: 'Pauses a song.',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) 
        {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            message.channel.send("Song has been paused. Use the !resume command to continue song.");
        }
        else
            message.channel.send("No song playing or song is already paused dumbass.");
	},
};