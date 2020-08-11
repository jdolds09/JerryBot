const Images = require("dabi-images");
const Client = new Images.Client();

// Butts command
module.exports = {
	name: 'gif',
	description: 'Post an image of a butt (Must be in NSFW channel).',
    execute(message) 
    {
        // Check to see if command was sent in NSFW channel
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            // Get butt image
            Client.nsfw.real.gif().then(json => {
                // Send image
                console.log(json.url);
                if(json.url.includes("redgif"))
                {
                    console.log("redgif");
                    // Embed gif
                    const embed = new Discord.MessageEmbed()
                        .setImage(url)
                        .setColor("RANDOM")
                        .setURL(url)
                        .setAuthor(url);
                    
                    // Send gif
                    return message.channel.send({embed});
                }

                console.log(json.url);
                return message.channel.send(json.url);
                }).catch(error => {
                    message.channel.send("Unable to fetch image. Please try again.");
                    console.log(error);
                });
        }
    },
};