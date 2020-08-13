const Images = require("dabi-images"); // Fetches images from Reddit
const Client = new Images.Client(); // Helps get message from Reddit to discord channel
const Discord = require("discord.js");

// Pokemon command
module.exports = {
	name: 'pokemon',
	description: 'Post a picture of a pokemon card(s).',
    execute(message) 
    {
        // Get pokemon card(s) image
        Client.nsfw.real.pokemon().then(json => {
            // Post pokemon card(s)
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