module.exports = {
	name: 'leave',
	description: 'Make JerryBot leave the voice channel',
	execute(message) {
        try
        {
            message.guild.me.voice.channel.leave();
        }
        catch(error)
        {
            console.log(error);
        }
	},
};