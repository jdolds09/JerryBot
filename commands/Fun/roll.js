// Roll command
module.exports = {
	name: 'roll',
	description: 'Roll a number between 1 and the number you provide [ex. !roll 69 (1-69)]. Default is 1-100.',
    execute(message) 
    {
        // Get number after !roll command if it exists
        const args = message.content.split(" ");

        // If number after !roll exists
        if(args.length > 1)
        {
            // Generate and output random number
            const result = Math.floor(Math.random() * args[1]);
            message.channel.send(`${message.author.username} rolls ${result} (1-${args[1]})`);
        }

        // Number after roll doesn't exist, do default roll from 1-100
        else
        {
            // Generate and output random number
            const result = Math.floor(Math.random() * 100);
            message.channel.send(`${message.author.username} rolls ${result} (1-100)`);
        }
    },
};