const Images = require("dabi-images");
const Client = new Images.Client();

// Cosplay command
module.exports = {
	name: 'cosplay',
	description: 'Post a cosplay image (Must be in NSFW channel).',
    execute(message) 
    {
        // Check to see if command was sent in NSFW channel
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            // Fetch boobs image
            Client.nsfw.real.cosplay().then(json => {
                // Post image in channel
                if(json.is_video)
                {
                    const embed = new Discord.MessageEmbed()
                        .setImage(url)
                        .setColor("RANDOM")
                        .setURL(url)
                        .setAuthor(url);
                        
                    return message.channel.send({embed});
                }
                return message.channel.send(json.url);
                }).catch(error => {
                    message.channel.send("Unable to fetch image. Please try again.");
                    console.log(error);
                });
        }
    },
};