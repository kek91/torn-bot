const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

let token;

if (process.env.TOKEN) {
    token = process.env.TOKEN;
}
else if(netlifyConfig.build.environment.TOKEN) {
    token = netlifyConfig.build.environment.TOKEN;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
