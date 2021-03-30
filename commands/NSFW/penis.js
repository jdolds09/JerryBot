// Penis command
module.exports = {
	name: 'penis',
	description: 'See how big your pee pee is',
    execute(message) 
    {
        const size = Math.floor(Math.random() * 11);
        var i;
        var shaft = "";

        for(i = 0; i < size; i++)
            shaft = shaft + "=";

        if(message.author.username == "DrunkenMaster89" || message.author.username == "ThatSaltySnipezGuy")
            shaft = "";

        message.channel.send(`${message.author.username}'s penis size:`);
        return message.channel.send(`8${shaft}D`);
    },
};