const fetch = require('node-fetch')
const {Client, Events, GatewayIntentBits} = require('discord.js');
require('dotenv').config()

const handler = async function () {

    let token;

    if (process.env.TOKEN) {
        token = process.env.TOKEN;
    } else if (netlifyConfig.build.environment.TOKEN) {
        token = netlifyConfig.build.environment.TOKEN;
    }

    const client = new Client({intents: [GatewayIntentBits.Guilds]});

    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.login(token);

    try {
        const response = await fetch('https://icanhazdadjoke.com', {
            headers: {Accept: 'application/json'},
        })
        if (!response.ok) {
            // NOT res.status >= 200 && res.status < 300
            return {statusCode: response.status, body: response.statusText}
        }
        const data = await response.json()

        return {
            statusCode: 200,
            body: JSON.stringify({msg: data.joke}),
        }
    } catch (error) {
        // output to netlify function log
        console.log(error)
        return {
            statusCode: 500,
            // Could be a custom message or object i.e. JSON.stringify(err)
            body: JSON.stringify({msg: error.message}),
        }
    }
}

module.exports = {handler}
