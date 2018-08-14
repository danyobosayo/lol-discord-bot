const request = require('request');
const config = require('./config.json');

const apiKey = config.riotApiKey;

const getSummonerRank = (summonerId, callback) => {
    request(`https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerId}?api_key=${apiKey}`, (error, response, body) => {
        const data = JSON.parse(body);

        if (data.status && data.status.status_code === 400) {
            callback && callback(data.status.status_code);
        } else {
            callback && callback(data);
        }
    });
};

const getCurrentGame = (summoner, callback) => {
    request(`https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${summoner.id}?api_key=${apiKey}`, (error, response, body) => {
        const data = JSON.parse(body);
        if (data.status && data.status.status_code === 404) {
            callback && callback(data.status.status_code);
        } else {
            callback(data);
        }
    });
};

const getSummonerByName = (summonerName, callback) => {
    request(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${apiKey}`, (error, response, body) => {
        const data = JSON.parse(body);
        callback && callback(data);
    });
};

module.exports = {
    getCurrentGame: (summonerName, callback) => {
        getSummonerByName(summonerName, (summoner) => {
            getCurrentGame(summoner, callback);
        });
    },
    getSummonerRank: (summonerName, callback) => {
        getSummonerByName(summonerName, (summoner) => {
            getSummonerRank(summoner.id, callback);
        });
    },
};
