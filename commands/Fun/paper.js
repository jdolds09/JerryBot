// Paper command
module.exports = {
	name: 'paper',
	description: 'Rock paper scissors. Do !paper to choose paper.',
    execute(message) 
    {
        // Generate a random number from 1-3
        const result = Math.floor(Math.random() * 3) + 1;
        // If random number == 1, JerryBot chooses Rock
        if(result == 1)
            message.channel.send("Rock. Shit.");
        // If random number == 2, JerryBot chooses Paper
        else if(result == 2)
            message.channel.send("Paper. Fuck we tied. Go againe.");
        // If random number == 3, JerryBot chooses Scissors
        else
            message.channel.send("Scissors. HAHAHAHA GET FUCKED BIOTCH!");
    },
};