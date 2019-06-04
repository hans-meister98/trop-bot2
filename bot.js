const Discord = require('discord.js');
const bot = new Discord.Client();

var request = require('request');
var cheerio = require('cheerio');

var Command = require('./command.js');

const channelId = '166812372286046208';
var now = new Date();
var baseDate = new Date('5/25/2019');
var diff = parseInt((now - baseDate) / (1000 * 60 * 60 * 24));
var i = 20 + diff;

let regularCoolDown = new Set();
let wtCoolDown = new Set();
let cdSeconds = 7;

bot.on('ready', () => {
    let channel = bot.channels.get(channelId);
    console.log('TROP_Bot started');

    try {
        let interval = setInterval(function () {

            let date = new Date();
	    let end;
		
            if ((30 - i) < 1){
                end = 'heute';
            } else {
                end = 'in ' + (30 - i) + ' Tagen'
            }

            if (date.getHours() === 17 && date.getMinutes() === 45) {
                let url = 'https://thereligionofpeace.com';
                let imageLink;

                request(url, function (error, response, html) {
                    if (!error) {
                        let $ = cheerio.load(html);

                        $('#aspnetForm > table > tbody > tr:nth-child(1) > td:nth-child(1) > div').filter(function () {
                            let data = $(this);
                            imageLink = data.find('img').attr('src');
                        });

                        channel.send(
                            '__**Ramadan Bombathon**__' + '\n'
                            + 'Tag ' + i + '\n'
                            + 'Ramadan endet ' + end + '\n'
                            + imageLink
                        );

                        console.log('Message for day ' + i + ' sent.');
                        i++;
                    }
                });
            }
        }, 60 * 1000);
    } catch (e) {
        console.log(e);
    }
});

/*bot.on('presenceUpdate', (oldMember, newMember) => {

    let channel = bot.channels.get(channelId);

    setTimeout(function () {
        if (oldMember.presence.status !== newMember.presence.status) {
            if (newMember.presence.status === 'online' && newMember.user.id === process.env.USER_ID) {
                channel.send('Fagott2402 ist anwesend.' + '\n'
							+ 'https://c1.staticflickr.com/1/119/272014930_22441b6263_b.jpg');
				console.log('Das Fagott ist anwesend.');
            }
        }
    }, 3000);
});*/

bot.on('message', msg => {

    let c_30 = new Command('!30', 'Islamistische Attacken der letzten 30 Tage.');
    let c_911 = new Command('!911', 'Islamistische Attacken seit dem 11. September 2001.');
    let c_aow = new Command('!aow', 'Atrocity of the Week - Gräueltat der Woche.');
    let c_bot = new Command('!bot', 'Informationen über den Bot und seine Commands.');

    let c_wt = new Command('!wt', 'Erstellt einen neuen Watch2gether Raum.')

    let commands = [c_30, c_911, c_aow, c_bot, c_wt];
    let check = false;

    for (let j = 0; j < commands.length - 1; j++)
    {
        if (msg.content === commands[j].getCallName()){
            check = true;
        }
    }

    if (check === true)
    {
        if (regularCoolDown.has(msg.author.id))
        {
            var date = new Date();
            console.log(date + ' - Regular Spam protection - caused by ' + msg.author.username);
        }

        else {

        if (msg.content === commands[0].getCallName()) {
            let url = 'https://thereligionofpeace.com/attacks/attacks.aspx?Yr=Last30/';
            request(url, function (error, response, html) {
                if (!error) {
                    let $ = cheerio.load(html);
    
                    let attacks;
                    let countries;
                    let killed;
                    let injured;
                    let s = '';
    
                    $('#aspnetForm > table > tbody > tr:nth-child(2) > td').filter(function () {
                        let data = $(this);
                        attacks = data.find('b:nth-child(6)').text();
                        countries = data.find('b:nth-child(7)').text();
                        killed = data.find('b:nth-child(8)').text();
                        injured = data.find('b:nth-child(9)').text();
    
                        s = 'in den letzten 30 Tagen gab es ' + attacks + ' islamistische Attacken in ' + countries + ' Ländern.' + ' Dabei wurden ' + killed + ' Menschen getötet und ' + injured + ' verletzt.';
                        msg.reply(s);
                        console.log(commands[0].getCallName() + ' - called by ' + msg.author.username);
                    });
                }
            });
        }
    
        if (msg.content === commands[1].getCallName()) {
            msg.reply('https://www.thereligionofpeace.com/TROP.jpg');

            console.log(commands[1].getCallName() + ' - called by ' + msg.author.username);
        }
    
        if (msg.content === commands[2].getCallName()) {
            let url = 'https://thereligionofpeace.com';
            request(url, function (error, response, html) {
                if (!error) {
                    let $ = cheerio.load(html);
    
                    let text1;
                    let text2;
                    let articleLink;
                    let imageLink;
                    let s = '';
    
                    $('#aspnetForm > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr:nth-child(1) > td').filter(function () {
                        let data = $(this);
                        text1 = data.find('a:nth-child(8)').text();
                        text2 = data.find('a:nth-child(10)').text();
                        articleLink = '<' + data.find('a:nth-child(8)').attr('href') + '>';
                        imageLink = 'https://thereligionofpeace.com/' + data.find('img').attr('src');
    
                        s =
                            '\n' + '**Atrocity of the week:**' + '\n'
                            + text1 + ' ' + text2 + '\n'
                            + articleLink + '\n'
                            + '\n'
                            + imageLink;
                        msg.reply(s);
                        console.log(commands[2].getCallName() + ' - called by ' + msg.author.username);
                    });
                }
            });
        }
    
		//INFO ABOUT BOT AND COMMANDS
        if (msg.content === commands[3].getCallName()) {
    
            let cmd_output = [];
    
            for (let x = 0; x < commands.length; x++) {
                if (x < commands.length - 1) {
                    cmd_output[x] = commands[x].getCallName() + ' - ' + commands[x].getDefinition() + '\n';
                } else {
                    cmd_output[x] = commands[x].getCallName() + ' - ' + commands[x].getDefinition();
                }
            }
    
            let info_text =
                '\n' + 'TROP_Bot - Statistiken über die Religion des Friedens' + '\n'
                + 'Quelle: https://thereligionofpeace.com/' + '\n'
                + '\n'
                + 'Verfügbare Commands:' + '\n';
    
            let cmd_string = cmd_output.toString();
            cmd_string = cmd_string.replace(/,/g, '');
    
            msg.reply(info_text + cmd_string);
            console.log(commands[3].getCallName() + ' - called by ' + msg.author.username);
        }
    
        regularCoolDown.add(msg.author.id);
        setTimeout(() => {
          // Removes the user from the set after 5 seconds
         regularCoolDown.delete(msg.author.id);
        }, cdSeconds * 1000);
        }   
    }

    if (msg.content === commands[4].getCallName())
    {
        if(wtCoolDown.has('created'))
        {
            var date = new Date();
            console.log(date + ' - WT Spam protection - caused by ' + msg.author.username);
        }
        
        else
        {
                //watch2gether automatic room creation function
                    let url = 'https://www.watch2gether.com';
        
                    request(url, function (error, response, html) {
                        if (!error) {
                            let $ = cheerio.load(html);
                            let s = '';
            
                            $('#create_room_form').filter(function () {
                                let data = $(this);
                                utf8 = data.find('#create_room_form > input[type="hidden"]:nth-child(1)').val();
                                authToken = data.find('#create_room_form > input[type="hidden"]:nth-child(2)').val();
                            });
            
                            var myJSONObject = {'utf8':'✓', 'authenticity_token':authToken};
            
                            request({
                                url: "https://www.watch2gether.com/rooms/create",
                                method: "POST",
                                json: true,   // <--Very important!!!
                                body: myJSONObject
                            }, function (error, response, body){
                                streamkey = response.body['streamkey'];
                                
                                let s = 'https://watch2gether.com/rooms/'+streamkey+'?lang=de';
                                msg.reply(s);
                                console.log(commands[4].getCallName() + ' - called by ' + msg.author.username);
                            });
                            }
                        });
                    wtCoolDown.add('created');
                    setTimeout(() => {

                    wtCoolDown.delete('created');
                    }, 60 * 1000);
                }
        }
});

bot.login(process.env.BOT_TOKEN);
