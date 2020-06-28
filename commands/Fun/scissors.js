// Scissors command
module.exports = {
	name: 'scissors',
	description: 'Rock paper scissors. Do !scissors to choose scissors.',
    execute(message) 
    {
        // Generate a random number from 1-3
        const result = Math.floor(Math.random() * 3);
        // If random number == 1, JerryBot chooses Rock
        if(result == 1)
            message.channel.send("Rock. HAHAHAHA GET FUCKED BIOTCH!.");
        // If random number == 2, JerryBot chooses Paper
        else if(result == 2)
            message.channel.send("Paper. Shit");
        // If random number == 3, JerryBot chooses Scissors
        else
            message.channel.send("Scissors. Fuck we tied. Go againe.");
    },
};