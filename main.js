const {Client, Events, GatewayIntentBits, REST, Routes} = require('discord.js');
const http = require("http");

require('dotenv').config()

/**
 * Authenticate discordjs bot
 */

let token;
if (process.env.TOKEN) {
    token = process.env.TOKEN;
} else if (netlifyConfig.build.environment.TOKEN) {
    token = netlifyConfig.build.environment.TOKEN;
}

let apikey;
if (process.env.APIKEY) {
    apikey = process.env.APIKEY;
} else if (netlifyConfig.build.environment.APIKEY) {
    apikey = netlifyConfig.build.environment.APIKEY;
}

let clientId;
if (process.env.CLIENTID) {
    clientId = process.env.CLIENTID;
} else if (netlifyConfig.build.environment.CLIENTID) {
    clientId = netlifyConfig.build.environment.CLIENTID;
}

/**
 * Setup bot commands
 */

const commands = [
    {
        name: 'ping',
        description: 'Replies with pong',
    },
    {
        name: 'verify',
        description: 'Verifies your Torn account'
    }
];

const rest = new REST({version: '10'}).setToken(token);

try {
    console.log('Refreshing application commands');
    rest.put(Routes.applicationCommands(clientId), {body: commands}).then(() => {
        console.log('Successfully reloaded application commands!');
    });
} catch (e) {
    console.log(`Error - could not set application commands: ${e}`);
}

const client = new Client({intents: [GatewayIntentBits.Guilds]});
// const channel = await client.channels.cache.get("1133680913398628362");

client.login(token);

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    console.log(`Received "${interaction.commandName}" interaction`);
    // console.log(interaction);

    if (interaction.commandName === 'ping') {
        console.log("Received ping interaction");
        await interaction.reply('Pong!');
    }

    else if(interaction.commandName === 'verify') {
        try {
            let userIdDiscord = interaction.user.id;
            console.log(`Verifying discord userid ${userIdDiscord} to Torn API...`);

            const response = await fetch(`https://api.torn.com/user/${userIdDiscord}?selections=discord,basic&comment=tornportal-discord&key=${apikey}`);
            const data = await response.json();

            if (!response.ok || data.hasOwnProperty('error')) {
                if (data.hasOwnProperty('error')) {
                    throw `API Error: ${data.error.error}`;
                }
                throw `API Error: Unknown`;
            }

            if (data.hasOwnProperty('discord') && data.hasOwnProperty('name')) {
                let userIdTorn = data.player_id;
                let usernameTorn = data.name;
                let nickname = `${usernameTorn} [${userIdTorn}]`;
                console.log(`Verified as Torn user: ${nickname}`);
                await interaction.reply(`Verified as Torn user: ${nickname}`);
                // const member = await interaction.options.getMember('user')
                const member = await interaction.guild.members.fetch(interaction.user.id)
                await member.setNickname(nickname);
            }
            else {
                console.log(`Could not verify Torn user.`);
                await interaction.reply(`Could not verify Torn user.`);
            }
        } catch (e) {
            console.log(e);
        }
    }

});


/**
 * node http server
 */

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    switch (req.url) {
        case "/test":
            res.writeHead(200);
            res.end(`{"message": "Hello world! This is your friendly bot speaking."}`);
            break
        case "/ping":
            res.writeHead(200);
            res.end(`{"message": "pong"}`);
            break;
        default:
            res.writeHead(404);
            res.end(`{"error": "404 Not Found"}`);
            break;
    }
}

const host = 'localhost';
const port = 8000;
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
