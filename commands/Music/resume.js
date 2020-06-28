// Resume command
module.exports = {
	name: 'resume',
	description: 'Continues a paused song.',
	execute(message) {
        // Get queue
        const serverQueue = message.client.queue.get(message.guild.id);
        
        // If queue exists and a song is currently paused
        if (serverQueue && !serverQueue.playing) 
        {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
        }
        // Unable to resume song
        else
            message.channel.send("No song playing or song is already playing dumbass.");
	},
};