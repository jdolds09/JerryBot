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
        var empty_file = false;

        if(!(args.length > 1))
            return message.channel.send("You must supply additional argument(s) along with the weight command.");

        if(typeof(Number(args[1])) === 'number')
        {
            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.txt`))
            {
                fs.readFile(`/app/commands/Fun/weight/${message.author.username}.txt`, 'utf8', function (err, data) {
                    if(err) return console.log(err);
                    if (data.length == 0)
                        empty_file = true;
                    if(data.includes(months[month]))
                    {
                        var length = months[month].length + 2;
                        if(data.substring(data.indexOf(months[month]) + length, data.indexOf(months[month]) + length + 4) == year)
                        {
                            message.channel.send("You have already entered a weight for this month.");
                            return message.channel.send("It's too much damn work to go back and replace that value. Fuck you.");
                        }
                    }
                    else
                    {
                        fs.appendFile(`/app/commands/Fun/weight/${message.author.username}.txt`, `${args[1]}\r\n${months[month]}\r\n${year}\r\n`, function (err) {
                            if (err) return console.log(err);
                            if(empty_file)
                                return message.channel.send("Please enter the weight you wish to be at by using the !weight target [desired weight] command");
                        });
                    }
                    console.log(data);
                });
            }

            else
                return message.channel.send("This user is not in the database. Jerry needs to add you.");
        }

    else if(args[1] == "clear")
    {
        if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.txt`))
        {
            fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.txt`, "", function (err) {
                if (err) return console.log(err);
            });
        }

        else
            return message.channel.send("This user is not in the database. Jerry needs to add you.");
    }
    
    else
        return message.channel.send("Incorrect arguments supplied with the weight command");
    },
};