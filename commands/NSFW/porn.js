const Images = require("dabi-images");
const Client = new Images.Client();

// Porn command
module.exports = {
	name: 'porn',
	description: 'Post a porn gif or pic (Must be in NSFW channel).',
    execute(message) 
    {
        // Check to see if command was sent in NSFW channel
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            // Get butt image
            Client.nsfw.real.porn().then(json => {
                // Send image
                return message.channel.send(json.url);
                }).catch(error => {
                    message.channel.send("Unable to fetch image. Please try again.");
                    console.log(error);
                });
        }
    },
};