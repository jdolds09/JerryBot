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
        var current_weight = "";
        var target_weight = 0;
        var goal = 0;
        var weight_loss = 0;
        var empty_file = false;

        if(args.length <= 1)
            return message.channel.send("You must supply additional argument(s) along with the weight command.");

        if(args[1].toLowerCase() == "clear")
        {
            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.txt`))
            {
                fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.txt`, "", function (err) {
                    if (err) return console.log(err);
                    return message.channel.send("Your weight tracking data has been cleared.");
                });
            }
    
            else
                return message.channel.send("This user is not in the database. Jerry needs to add you.");
        }

        else if(args[1].toLowerCase() == "target")
        {
            if(args.length < 3)
            {
                message.channel.send("You did not supply enough arguments to satisfy the command.");
                return message.channel.send("You can enter a target weight by using the !weight target [desired weight] command.");
            }

            if(Number(args[2]) == NaN)
            {
                message.channel.send("The desired weight must be a integer or decimal number dumbass.");
                return message.channel.send("You can enter a target weight by using the !weight target [desired weight] command.");
            }

            target_weight = Number(args[2]);

            fs.readFile(`/app/commands/Fun/weight/${message.author.username}.txt`, 'utf8', function (err, data) {
                if(err) return console.log(err);
                if(data.length == 0)
                    return message.channel.send("You must enter your current weight before entering your target weight.");
                const month_length = months[month].length + 2;    
                data = data.substring(0, data.length - (8 + month_length));
                console.log(data);
                if(!(data.includes("January") || data.includes("February") || data.includes("March") || data.includes("April") || data.includes("May") || data.includes("June") || data.includes("July") || data.includes("August") || data.includes("September") || data.includes("October") || data.includes("November") || data.includes("December")))
                    current_weight = Number(data);
                else
                {
                    while(data.charAt(data.length - 1) != '\n')
                    {
                        current_weight = data.charAt(data.length - 1) + current_weight;
                        data = data.substring(0, data.length - 1);
                    }
                }
            });

            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}_goal.txt`))
            {
                fs.writeFile(`/app/commands/Fun/weight/${message.author.username}_goal.txt`, `${args[2]}`, function (err) {
                    if (err) return console.log(err);
                    current_weight = Number(current_weight);
                weight_loss = Math.abs(current_weight - target_weight);
                goal = weight_loss * .1;
                if(goal > 8)
                    goal = 8;
                return message.channel.send(`${message.author.username}, your goal is to lose ${goal} pound(s) this month. Good luck! :)`);
                });
            }

            else
                return message.channel.send("This user is not in the database. Jerry needs to add you.");
        }

        else if(Number(args[1]) != NaN)
        {
            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.txt`))
            {
                fs.readFile(`/app/commands/Fun/weight/${message.author.username}.txt`, 'utf8', function (err, data) {
                    if(err) return console.log(err);
                    if (data.length == 0)
                        empty_file = true;
                    else
                    {
                        fs.readFile(`/app/commands/Fun/weight/${message.author.username}_goal.txt`, 'utf8', function (err, goal_data) {
                            if(err) return console.log(err);
                            if(data.length == 0)
                            {
                                message.channel.send("You must enter a target weight before entering another weight.");
                                return message.channel.send("You can enter a target weight by using the !weight target [desired weight] command.");
                            }
                        });
                    }

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
                });
            }

            else
                return message.channel.send("This user is not in the database. Jerry needs to add you.");
        }
    
        else
            return message.channel.send("Incorrect arguments supplied with the weight command");
    },
};