const fs = require('fs');
const Datastore = require('nedb');

// Weight command
module.exports = {
	name: 'weight',
	description: 'Keep track of your weight loss progress',
    execute(message) 
    {
        // Get all arguments
        const args = message.content.split(" ");

        // Database
        let database = new Datastore({ filename: `/app/commands/Fun/weight/${message.author.username}.json`});

        // Get date
        const date_ob = new Date();
        const month = date_ob.getMonth();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const year = date_ob.getFullYear();
        var target_weight = 0;

        // User object
        var user = {
            name: message.author.username,
            weight: [],
            month: [],
            year: [],
            target_weight: 0,
            month_goal: [],
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
                        database.loadDatabase();
                        database.find({name: message.author.username}, function (err, doc) {
                            if(err) console.log(err);
                            if(Object.keys(doc).length == 0)
                            {
                                message.channel.send("You must set your current weight before setting target weight");
                                return message.channel.send("You can set your current weight by using !weight [current_weight] command.");
                            }
                            
                            else
                            {
                                user.weight = doc.weight;
                                user.month = doc.month;
                                user.year = doc.year;
                                user.target_weight = target_weight;
                                user.month_goal = doc.month_goal;
                                user.month_goal[user.month_goal.length - 1] = (Math.abs(boy.weight[boy.weight.length - 1] - target_weight)) * .1;

                                if(target_weight > user.weight[user.weight.length - 1])
                                {
                                    fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(user), err => {
                                        if(err) console.log(err);
                                    });

                                    database.insert(user);

                                    return message.channel.send(`Your goal this month is to gain ${user.month_goal[user.month_goal.length - 1]} pound(s). Good luck! :)`);
                                }

                                else
                                {
                                    fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(user), err => {
                                        if(err) console.log(err);
                                    });

                                    database.insert(user);

                                    return message.channel.send(`Your goal this month is to lose ${user.month_goal[user.month_goal.length - 1]} pound(s). Good luck! :)`);
                                }
                            }
                        });
                    }
                    
                    else
                    {
                        var boy = JSON.parse(data);
                        boy.target_weight = target_weight;
                        boy.month_goal.push((Math.abs(boy.weight[boy.weight.length - 1] - target_weight)) * .1);

                        if(target_weight > boy.weight[boy.weight.length - 1])
                        {
                            fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(boy), err => {
                                if(err) console.log(err);
                            });

                            database.insert(boy);

                            return message.channel.send(`Your goal this month is to gain ${boy.month_goal[boy.month_goal.length - 1]} pound(s). Good luck! :)`);
                        }

                        else
                        {
                            fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(boy), err => {
                                if(err) console.log(err);
                            });

                            database.insert(boy);

                            return message.channel.send(`Your goal this month is to lose ${boy.month_goal[boy.month_goal.length - 1]} pound(s). Good luck! :)`);
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
                        database.loadDatabase();
                        database.find({name: message.author.username}, function (err, doc) {
                            if(err) console.log(err);
                            if(Object.keys(doc).length == 0)
                            {
                                user.weight.push(Number(args[1]));
                                user.month.push(months[month]);
                                user.year.push(year);
                                fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(user), err => {
                                    if(err) console.log(err);
                                });
                                return message.channel.send("Please enter the weight you wish to be at by using the !weight target [desired weight] command");
                            }
                            
                            else
                            {
                                user.weight = doc.weight;
                                user.month = doc.month;
                                user.year = doc.year;
                                user.target_weight = doc.target_weight;
                                user.month_goal = doc.month_goal;

                                if(user.target_weight == 0)
                                {
                                    message.channel.send("You must set a target weight before setting a new weight");
                                    return message.channel.send("You can set your current weight by using !weight [current_weight] command.");
                                }

                                if(boy.month[boy.month.length - 1] == months[month] && boy.year[boy.year.length - 1] == year)
                                    return message.channel.send("You already entered a weight this month. It's too much work to go back and change it. Fuck you.");

                                user.weight.push(Number(args[1]));
                                user.month.push(months[month]);
                                user.year.push(year);
                                user.month_goal.push((Math.abs(user.weight[user.weight.length - 1] - user.target_weight)) * .1);
                                fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(user), err => {
                                    if(err) console.log(err);
                                });
                                
                                if(user.target_weight > user.weight[user.weight.length - 1])
                                {
                                    database.insert(user);
                                    return message.channel.send(`Your goal this month is to gain ${user.month_goal[user.month_goal.length - 1]} pound(s). Good luck! :)`);
                                }

                                else
                                {
                                    database.insert(user);
                                    return message.channel.send(`Your goal this month is to lose ${user.month_goal[user.month_goal.length - 1]} pound(s). Good luck! :)`);
                                }
                            }
                        });
                    }

                    else
                    {
                        var boy = JSON.parse(data);

                        if(boy.target_weight == 0)
                        {
                            message.channel.send("You must set a target weight before setting a new weight");
                            return message.channel.send("You can set your current weight by using !weight [current_weight] command.");
                        }

                        if(boy.month[boy.month.length - 1] == months[month] && boy.year[boy.year.length - 1] == year)
                            return message.channel.send("You already entered a weight this month. It's too much work to go back and change it. Fuck you.");

                        boy.weight.push(Number(args[1]));
                        boy.month.push = months[month];
                        boy.year.push(year);
                        boy.month_goal.push((Math.abs(boy.current_weight - boy.target_weight)) * .1);

                        fs.writeFile(`/app/commands/Fun/weight/${message.author.username}.json`, JSON.stringify(boy), err => {
                            if(err) console.log(err);
                            if(boy.target_weight > boy.weight[boy.weight.length - 1])
                                return message.channel.send(`Your goal this month is to gain ${boy.month_goal[boy.month_goal.length - 1]} pound(s). Good luck! :)`);
                            else
                                return message.channel.send(`Your goal this month is to gain ${boy.month_goal[boy.month_goal.length - 1]} pound(s). Good luck! :)`);
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