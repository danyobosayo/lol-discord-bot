const Discord = require('discord.js');
const riotApi = require('./riot-api.js');
const config = require('./config.json');

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
            message.channel.send('pong');
        }

        if (message.content.indexOf('rank: ' === 0)) {
            const split = message.content.split('rank: ');
            if (split.length === 2) {
                riotApi.getSummonerRank(split[1], (rankedInfo) => {
                    if (rankedInfo === 400) {
                        message.channel.send('I could not find that summoner');
                        return;
                    }

                    const soloQueue = rankedInfo.find(league => league.queueType === 'RANKED_SOLO_5x5');
                    if (!soloQueue) {
                        message.channel.send('Unranked');
                    } else {
                        let rankString = `${soloQueue.tier} ${soloQueue.rank} ${soloQueue.leaguePoints} LP`;

                        if (soloQueue.miniSeries) {
                            let progress = soloQueue.miniSeries.progress.split('');

                            progress = progress.map(p => p === 'N' ? 'O' : p).join('');

                            rankString = `${rankString} ${progress}`;
                        }

                        message.channel.send(rankString);
                    }
                });
            }
        }

        if (message.content === 'help') {
            message.channel.send('try:\n`rank: {summoner name}`\n`ping`\n`help`');
        }
    }
});

client.login(config.discordBotToken);
