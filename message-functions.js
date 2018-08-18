const riotApi = require('./riot-api.js');

const getRank = (message, callback) => {
    const split = message.split('rank: ');

    if (split.length === 2) {
        riotApi.getSummonerRank(split[1], (rankedInfo) => {
            if (rankedInfo.errorCode === 400) {
                callback('I could not find that summoner');
            } else {
                const soloQueue = rankedInfo.find(league => league.queueType === 'RANKED_SOLO_5x5');

                if (!soloQueue) {
                    callback('Unranked');
                } else {
                    let rankString = `${soloQueue.tier} ${soloQueue.rank} ${soloQueue.leaguePoints} LP`;

                    if (soloQueue.miniSeries) {
                        let progress = soloQueue.miniSeries.progress.split('');

                        progress = progress.map(p => p === 'N' ? 'O' : p).join('');

                        rankString = `${rankString} ${progress}`;
                    }

                    callback(rankString);
                }
            }
        });
    }
};

const choices = {
    ping: () => {
        return 'pong';
    },
    rank: getRank,
    help: () => {},
};

const helpArray = [];

for (let choice in choices) {
    helpArray.push(choice);
}

const helpString = `try:\n\`${helpArray.join('`\n`')}\``;

choices.help = () => {
    return helpString;
}

module.exports = {
    ...choices
};
