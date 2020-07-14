const Images = require("dabi-images"); // Fetches images from Reddit
const Client = new Images.Client(); // Helps get message from Reddit to discord channel

// Meme command
module.exports = {
	name: 'meme',
	description: 'Post a meme.',
    execute(message) 
    {
        // Get meme image
        Client.nsfw.real.meme().then(json => {
            // Post meme
            return message.channel.send(json.url);
            }).catch(error => {
                message.channel.send("Unable to fetch image. Please try again.");
                console.log(error);
            });
    },
};