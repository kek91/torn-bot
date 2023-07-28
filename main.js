const { Client, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const http = require("http");

require('dotenv').config()

const host = 'localhost';
const port = 8000;

let token;

if (process.env.TOKEN) {
    token = process.env.TOKEN;
}
else if(netlifyConfig.build.environment.TOKEN) {
    token = netlifyConfig.build.environment.TOKEN;
}



const commands = [
    {
        name: 'ping',
        description: 'Replies with pong',
    },
];

const rest = new REST({ version: '10' }).setToken(token);


try {
    console.log('started refreshing application (/) commands');

    rest.put(Routes.applicationCommands("1133748577622052874"), {body: commands}).then( () => {
        console.log('okkkk');
    });

    console.log('successfully reloaded application (/) commands');
} catch (e) {
    console.log(`Error: ${e}`);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// const channel = await client.channels.cache.get("1133680913398628362");

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');client.login(token);
  }
});


const requestListener = function(req, res) {
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

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

