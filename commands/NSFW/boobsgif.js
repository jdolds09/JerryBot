const Images = require("dabi-images");
const Client = new Images.Client();

// Boobsgif command
module.exports = {
	name: 'boobsgif',
	description: 'Post a boobs gif (Must be in NSFW channel).',
    execute(message) 
    {
        // Check to see if command was sent in NSFW channel
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            // Get butt image
            Client.nsfw.real.boobsgifs().then(json => {
                // Send image
                return message.channel.send(json.url);
                }).catch(error => {
                    message.channel.send("Unable to fetch image. Please try again.");
                    console.log(error);
                });
        }
    },
};