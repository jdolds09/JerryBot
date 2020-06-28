const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");
const Client2 = require('../../client/Client');
const client = new Client2();
const prefix = '!';

module.exports = {
	name: 'buttsgif',
	description: 'Post a butt gif (Must be in NSFW channel).',
    execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            Client.nsfw.real.buttgifs().then(json => {
                console.log(json.url);
                return message.channel.send(json.url);
                }).catch(error => {
                    console.log(json.url);
                    console.log(error);
                });
        }
    },
};