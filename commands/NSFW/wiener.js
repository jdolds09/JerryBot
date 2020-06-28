const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");
const Client2 = require('../../client/Client');
const client = new Client2();
const prefix = '!';

module.exports = {
	name: 'wiener',
	description: 'Post an image of a wiener (Must be in NSFW channel).',
    execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            Client.nsfw.real.wiener().then(json => {
                return message.channel.send(json.url);
                }).catch(error => {
                    console.log(error);
                });
        }
    },
};