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
        var target_weight = 0;
        var users;

        // User object
        var user = {
            name: message.author.username,
            current_weight: 0,
            month: "",
            year: "",
            target_weight: 0,
            month_goal: 0,
        };

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

            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.json`))
            {
                fs.readFile(`/app/commands/Fun/weight/${message.author.username}.json`, (err, data) => {
                    if (err) console.log(err);
                    if(data.length == 0)
                    {
                        message.channel.send("You must set your current weight before setting target weight");
                        return message.channel.send("You can set your current weight by using !weight [current_weight] command.");
                    }
                    
                    else
                    {
                        var boy = JSON.parse(data);
                        boy.target_weight = target_weight;
                        boy.month_goal = (Math.abs(boy.current_weight - target_weight)) * .1;

                        if(target_weight > boy.current_weight)
                        {
                            fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(boy), err => {
                                if(err) console.log(err);
                            });
                            return message.channel.send(`Your goal this month is to gain ${boy.month_goal} pound(s). Good luck! :)`);
                        }

                        else
                        {
                            fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(boy), err => {
                                if(err) console.log(err);
                            });
                            return message.channel.send(`Your goal this month is to lose ${boy.month_goal} pound(s). Good luck! :)`);
                        }
                    }
                });
            }

            else
                return message.channel.send("This user is not in the database. Jerry needs to add you.");
        }

        else if(args[1].toLowerCase() == "progress")
        {
            
        }

        else if(Number(args[1]) != NaN)
        {
            if(fs.existsSync(`/app/commands/Fun/weight/${message.author.username}.json`))
            {
                fs.readFile(`/app/commands/Fun/weight/${message.author.username}.json`, (err, data) => {
                    if (err) console.log(err);
                    if(data.length == 0)
                    {
                        user.current_weight = Number(args[1]);
                        user.month = months[month];
                        user.year = year;
                        fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(user), err => {
                            if(err) console.log(err);
                        });
                        return message.channel.send("Please enter the weight you wish to be at by using the !weight target [desired weight] command");
                    }

                    else
                    {
                        // Get user
                        const dude = require(`/app/commands/Fun/weight/${message.author.username}.json`);
                        users = JSON.parse(data);
                        users.forEach(boy => {
                            if(boy.month == months[month] && boy.year == year)
                            {
                                message.channel.send("You already set a weight for this month. It's too hard to go back and change that.");
                                return message.channel.send("Fuck you.");
                            }
                            user.target_weight = boy.target_weight;
                        });

                        user.current_weight = Number(args[1]);
                        user.month = months[month];
                        user.year = year;
                        user.month_goal = (Math.abs(user.current_weight - user.target_weight)) * .1;

                        dude.push(user);
                        fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(dude), err => {
                            if(err) console.log(err);
                            if(user.target_weight > user.current_weight)
                                return message.channel.send(`Your goal this month is to gain ${user.month_goal} pound(s). Good luck! :)`);
                            else
                                return message.channel.send(`Your goal this month is to gain ${user.month_goal} pound(s). Good luck! :)`);
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