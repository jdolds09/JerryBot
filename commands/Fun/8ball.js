// Roll command
module.exports = {
	name: '8ball',
	description: 'Returns a magic 8 ball response',
    execute(message) 
    {
        try
        {
            const responses = ["Fuck No.", "No Fucking Way.", "Abso-Fucking-Lutely.", "100 Fucking Percent dude.", "How the Fuck am I supposed to know?", "You're Goddamn Right.", "Haaaaaaaaail Nah.", "You Bet Your Ass.", "Who the Fuck Knows.", "Without a Fucking Doubt.", "Not Even Fucking Close.", "I Don't Give a Shit.", "Alex likes wieners. That is the Answer.", "Hell Yea Brother.", "Negative.", "Does a Bear Shit in the Woods?", "No way in Hell.", "You Bet your Ass.", "That's Horseshit.", "Best Fucking Believe.", "Nope.", "Yup,", "Gif"];

            const result = Math.floor((Math.random() * responses.length));

            if(responses[result] == "Gif")
                message.channel.send("", {files: ['./images/no.gif']});

            else
                return message.channel.send(`**${responses[result]}**`)
        }
        catch(error)
        {
            console.log(error);
            return message.channel.send(error);
        }
    },
};