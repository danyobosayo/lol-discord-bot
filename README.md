# Discord bot for Riot API
v 0.1.0

This bot can be commanded to show game info for ongoing League of Legends games.

### Steps to set it up yourself:
1) Create a discord bot. Discord has a simple process to streamline this.
2) `git clone` this project, `npm i`, and set up your own `config.json`. You'll need a Riot API key and a Discord bot token.
3) The entry point to the application is `discord-interface.js` so call `node discord-interface.js`.

### `config.json` options:
* `riotApiKey`: For your Riot API key
* `discordBotToken`: For your discord bot token
* `singleChannelId`: If you want to limit your bot to a specific text channel, put the channel ID here
