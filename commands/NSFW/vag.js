const Images = require("dabi-images");
const Client = new Images.Client();

module.exports = {
	name: 'butts',
	description: 'Post an image of a butt (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.vag().then(json => {
            embed = new Discord.MessageEmbed()
                .setImage(json.url)
                .setColor('RANDOM')
                .setURL(json.url)
                .setAuthor(json.url);
            return message.channel.send({embed});
            }).catch(error => {
                console.log(error);
            });
    },
};