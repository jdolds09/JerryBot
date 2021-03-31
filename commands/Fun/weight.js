const fs = require('fs');


// Weight command
module.exports = {
	name: 'weight',
	description: 'Keep track of your weight loss progress',
    execute(message) 
    {
        // Get all arguments
        const args = message.content.split(" ");

        // Get date
        const date_ob = new Date();
        const month = date_ob.getMonth();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const year = date_ob.getFullYear();

        if(!(args.length > 1))
            return message.channel.send("You must supply additional argument(s) along with the weight command.");

        if(typeof(Number(args[1])) === 'number')
        {
            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.txt`))
            {
                fs.appendFile(`/app/commands/Fun/weight/${message.author.username}.txt`, `${args[1]}\r\n${months[month]}\r\n${year}`, function (err) {
                    if (err) return console.log(err);
                });

                fs.readFile(`/app/commands/Fun/weight/${message.author.username}.txt`, 'utf8', function (err, data) {
                    if(err) return console.log(err);
                    console.log(data);
                    console.log(data.indexOf(months[month]));
                });
            }

            else
                return message.channel.send("This user is not in the database. Jerry needs to add you.");
        }
    },
};