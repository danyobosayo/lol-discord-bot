const riotApi = require('./riot-api.js');

const champs = {};

riotApi.getChampions((data) => {
    data.data;

    for (let name in data.data) {
        const champ = data.data[name];
        champs[champ.key] = champ;
    }
});

const getSummonerNameFromCommand = (command, commandName) => {
    const split = command.split(commandName);
    return split.splice(1, split.length).join(commandName);
};

const getRankString = (rankedInfo) => {
    if (rankedInfo.errorCode === 400) {
        return 'I could not find that summoner';
    } else {
        const soloQueue = rankedInfo.find(league => league.queueType === 'RANKED_SOLO_5x5');

        if (!soloQueue) {
            return 'Unranked';
        }

        let rankString = `${soloQueue.tier} ${soloQueue.rank} ${soloQueue.leaguePoints} LP`;

        if (soloQueue.miniSeries) {
            let progress = soloQueue.miniSeries.progress.split('');

            progress = progress.map(p => p === 'N' ? 'O' : p).join('');

            rankString = `${rankString} ${progress}`;
        }

        return rankString;
    }
};

const getCurrentGameSummonerString = (summoner) => {
    return `${summoner.participant.summonerName} - ${summoner.champion.name} - ${getRankString(summoner)}`;
};

const getTeamString = (team) => {
    const teamName = team[0].participant.teamId === 100 ? 'Blue' : 'Red';

    return `${teamName} Team:\n${team.map(getCurrentGameSummonerString).join('\n')}\n`;
};

const getRank = (message, callback) => {
    const summonerName = getSummonerNameFromCommand(message, 'rank ');

    riotApi.getSummonerRankByName(summonerName, (rankedInfo) => {
        callback(getRankString(rankedInfo));
    });
};

const getCurrentGameInfo = (message, callback) => {
    const summonerName = getSummonerNameFromCommand(message, 'game ');

    riotApi.getCurrentGame(summonerName, (currentGame) => {
        if (currentGame.errorCode === 404 || !currentGame.participants) {
            callback('That summoner is not currently in a game');
            return;
        }

        let recursiveCallback;
        const summoners = [];

        recursiveCallback = (summoner) => {
            summoner.champion = champs[currentGame.participants[summoners.length].championId];
            summoner.participant = currentGame.participants[summoners.length];
            summoners.push(summoner);

            if (summoners.length === currentGame.participants.length) {
                const blueTeam = summoners.filter(s => s.participant.teamId === 100);
                const redTeam = summoners.filter(s => s.participant.teamId === 200);

                callback(`${getTeamString(blueTeam)}\n${getTeamString(redTeam)}`);
            } else {
                riotApi.getSummonerRank(currentGame.participants[summoners.length - 1].summonerId, recursiveCallback);
            }
        };

        riotApi.getSummonerRank(currentGame.participants[0].summonerId, recursiveCallback);
    });
};

const choices = {
    help: () => {},
    ping: () => {
        return 'pong';
    },
    rank: getRank,
    game: getCurrentGameInfo,
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
