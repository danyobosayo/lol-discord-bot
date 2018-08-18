const request = require('request');
const config = require('./config.json');

const apiKey = config.riotApiKey;

const getData = (body, statusCodes, callback) => {
    const data = JSON.parse(body);

    if (!callback) return;

    if (data.status) {
        if (data.status.status_code === 403) {
            callback({ errorCode: 403 });
        } else if (statusCodes.length && statusCodes.indexOf(data.status.status_code) !== -1) {
            callback({ errorCode: data.status.status_code });
        }
    }

    callback(data)
}

const makeRequest = (url, statusCodes, callback) => {
    request(url, (error, response, body) => {
        getData(body, statusCodes, callback);
    });
}

const getSummonerRank = (summonerId, callback) => {
    const url = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerId}?api_key=${apiKey}`;

    makeRequest(url, [400], callback);
};

const getCurrentGame = (summonerId, callback) => {
    const url = `https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${summonerId}?api_key=${apiKey}`;

    makeRequest(url, [404], callback);
};

const getSummonerByName = (summonerName, callback) => {
    const url = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${apiKey}`;

    makeRequest(url, [], callback);
};

module.exports = {
    getCurrentGame: (summonerName, callback) => {
        getSummonerByName(summonerName, (summoner) => {
            if (summoner.errorCode) callback(summoner);

            getCurrentGame(summoner.id, callback);
        });
    },
    getSummonerRank: (summonerName, callback) => {
        getSummonerByName(summonerName, (summoner) => {
            if (summoner.errorCode) callback(summoner);

            getSummonerRank(summoner.id, callback);
        });
    },
};
