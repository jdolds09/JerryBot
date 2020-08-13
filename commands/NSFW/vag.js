const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

// Vag command
module.exports = {
	name: 'vag',
	description: 'Post an image of a vag (Must be in NSFW channel).',
    execute(message) 
    {
        // Check to see if message was sent in NSFW channel
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            // Get image
            Client.nsfw.real.vag().then(json => {
                // Send image
                if(json.is_video)
                {
                    const embed = new Discord.MessageEmbed()
                        .setImage(json.url)
                        .setColor("RANDOM")
                        .setURL(json.url)
                        .setAuthor(json.url);
                        
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