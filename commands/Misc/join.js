module.exports = {
	name: 'join',
	description: 'Add JerryBot to voice channel.',
	execute(message) {
        try
        {
            message.guild.me.voice.channel.join();
        }
        catch(error)
        {
            console.log(error);
        }
	},
};