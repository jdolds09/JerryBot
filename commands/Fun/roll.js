module.exports = {
	name: 'roll',
	description: 'Roll a number between 1 and the number you provide [ex. !roll 69 (1-69)]. Default is 1-100.',
    execute(message) 
    {
        const args = message.content.split(" ");
        if(args.length > 1)
        {

            const result = Math.floor(Math.random() * args[1]);
            message.content.send(`${message.author.username} rolls ${result} (1-${args[1]})`);
        }
        else
        {
            const result = Math.floor(Math.random() * 100);
            message.content.send(`${message.author.username} rolls ${result} (1-100)`);
        }
    },
};