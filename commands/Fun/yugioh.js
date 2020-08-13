const Images = require("dabi-images"); // Fetches images from Reddit
const Client = new Images.Client(); // Helps get message from Reddit to discord channel
const Discord = require("discord.js");

// Yugioh command
module.exports = {
	name: 'yugioh',
	description: 'Post a picture of a yugioh card(s).',
    execute(message) 
    {
        // Get yugioh card(s) image
        Client.nsfw.real.yugioh().then(json => {
            // Post yugioh card(s)
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
    },
};