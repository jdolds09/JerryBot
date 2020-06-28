const Images = require("dabi-images");
const Client = new Images.Client();

// Butts command
module.exports = {
	name: 'butts',
	description: 'Post an image of a butt (Must be in NSFW channel).',
    execute(message) 
    {
        // Check to see if command was sent in NSFW channel
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            // Get butt image
            Client.nsfw.real.butts().then(json => {
                // Send image
                return message.channel.send(json.url);
                }).catch(error => {
                    console.log(error);
                });
        }
    },
};