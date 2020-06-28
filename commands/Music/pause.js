// Pause command
module.exports = {
	name: 'pause',
	description: 'Pauses a song.',
	execute(message) {
        // Get queue of songs
        const serverQueue = message.client.queue.get(message.guild.id);
        
        // If queue exists and a song is currently playing, pause the song
        if (serverQueue && serverQueue.playing) 
        {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            message.channel.send("Song has been paused. Use the !resume command to continue song.");
        }
        // Unable to pause song
        else
            message.channel.send("No song playing or song is already paused dumbass.");
	},
};