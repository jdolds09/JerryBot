module.exports = {
	name: 'scissors',
	description: 'Rock paper scissors. Do !scissors to choose scissors.',
    execute(message) 
    {
        const result = Math.floor(Math.random() * 3);
        if(result == 1)
            message.channel.send("Rock. HAHAHAHA GET FUCKED BIOTCH!.");
        else if(result == 2)
            message.channel.send("Paper. Shit");
        else
            message.channel.send("Scissors. Fuck we tied. Go againe.");
    },
};