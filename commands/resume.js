module.exports = {
	name: 'resume',
	description: 'Continues a paused song.',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) 
        {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
        }
        else
            message.channel.send("No song playing or song is already playing dumbass.");
	},
};