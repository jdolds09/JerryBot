// Confess command
module.exports = {
	name: 'confession',
	description: 'Confess your sins to JerryBot so that you may be cleanse',
    execute(message) 
    {
        try
        {
            // Generate random number
            const result = Math.floor((Math.random() * 100) + 1);
            
            if(result < 6)
            {
                message.channel.send("That is an act that I cannot forgive my son, may you burn in eternal hellfire for your actions.");
                return message.channel.send("", {files: ['/app/images/devl.gif']});
            }

            else
            {
                return message.channel.send("You are forgiven my son. Be cleansed of all guilt your actions have brought upon you.");
            }
        }
        catch(error)
        {
            console.log(error);
        }
    },
};