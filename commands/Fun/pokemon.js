const Images = require("dabi-images"); // Fetches images from Reddit
const Client = new Images.Client(); // Helps get message from Reddit to discord channel

// Pokemon command
module.exports = {
	name: 'pokemon',
	description: 'Post a picture of a pokemon card(s).',
    execute(message) 
    {
        // Get pokemon card(s) image
        Client.nsfw.real.pokemon().then(json => {
            // Post pokemon card(s)
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};