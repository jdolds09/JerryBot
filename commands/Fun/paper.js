module.exports = {
	name: 'paper',
	description: 'Rock paper scissors. Do !paper to choose paper.',
    execute(message) 
    {
        const result = Math.floor(Math.random() * 3);
        if(result == 1)
            message.channel.send("Rock. Shit.");
        else if(result == 2)
            message.channel.send("Paper. Fuck we tied. Go againe.");
        else
            message.channel.send("Scissors. HAHAHAHA GET FUCKED BIOTCH!");
    },
};