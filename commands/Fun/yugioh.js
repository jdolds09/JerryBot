const Images = require("dabi-images"); // Fetches images from Reddit
const Client = new Images.Client(); // Helps get message from Reddit to discord channel

// Yugioh command
module.exports = {
	name: 'yugioh',
	description: 'Post a picture of a yugioh card(s).',
    execute(message) 
    {
        // Get yugioh card(s) image
        Client.nsfw.real.yugioh().then(json => {
            // Post yugioh card(s)
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};