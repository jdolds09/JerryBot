module.exports = {
	name: 'rock',
	description: 'Rock paper scissors. Do !rock to choose rock.',
    execute(message) 
    {
        const result = Math.floor(Math.random() * 3);
        if(result == 1)
            message.channel.send("Rock. Fuck we tied. Go againe.");
        else if(result == 2)
            message.channel.send("Paper. HAHAHAHA GET FUCKED BIOTCH!");
        else
            message.channel.send("Scissors. Shit.");
    },
};