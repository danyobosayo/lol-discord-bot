const Discord = require('discord.js');
const riotApi = require('./riot-api.js');
const config = require('./config.json');
const messageFunctions = require('./message-functions.js');

const client = new Discord.Client();
let me = null;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    me = client.user.id;
});
 
client.on('message', message => {
    if (message.author.id === me) return;

    if (config.singleChannelId === '' || config.singleChannelId === message.channel.id) {

        if (message.content === 'ping') {
            message.channel.send(messageFunctions.ping());
        } else if (message.content === 'help') {
            message.channel.send(messageFunctions.help());
        } else if (message.content.indexOf('rank ') === 0) {
            messageFunctions.rank(message.content, (response) => {
                message.channel.send(response);
            });
        } else if (message.content.indexOf('game ') === 0) {
            messageFunctions.game(message.content, (response) => {
                message.channel.send(response);
            });
        }
    }
});

client.login(config.discordBotToken);
