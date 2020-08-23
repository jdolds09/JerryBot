// Shuffle command
module.exports = {
	name: 'shuffle',
	description: 'Shuffles the songs in a playlist.',
	execute(message) {
        // Get queue of songs
        const serverQueue = message.client.queue.get(message.guild.id);
        
        // If queue exists and a song is currently playing, pause the song
        if (serverQueue && serverQueue.playing && serverQueue.playlist) 
        {
            var current_index = serverQueue.videos.length;
            var temp_value;
            var random_index;

            // Fisher-Yates (aka Knuth) Shuffle algorith,
            while (0 !== current_index)
            {
                // Pick an element that has not been shuffled
                random_index = Math.floor(Math.random() * current_index);
                current_index -= 1;

                // Swap with current element
                temp_value = serverQueue.videos[current_index];
                serverQueue.videos[current_index] = serverQueue.videos[random_index];
                serverQueue.videos[random_index] = temp_value;
            }

            // Skip song
            serverQueue.song_num = 0;
			serverQueue.connection.dispatcher.end();
        }
        // Unable to shuffle playlist
        else
            message.channel.send("Must be currently playing a playlist dumbass.");
	},
};