const Images = require("dabi-images"); // Fetches images from Reddit
const Client = new Images.Client(); // Helps get message from Reddit to discord channel

// Food command
module.exports = {
	name: 'food',
	description: 'Post a pic of food.',
    execute(message) 
    {
        // Get food image
        Client.nsfw.real.food().then(json => {
            // Post food image
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
    },
};