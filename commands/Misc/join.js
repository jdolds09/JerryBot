module.exports = {
	name: 'join',
	description: 'Add JerryBot to voice channel.',
	execute(message) {
        try
        {
            message.member.voice.channel.join();
        }
        catch(error)
        {
            console.log(error);
        }
	},
};