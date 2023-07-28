const { Client, Events, GatewayIntentBits } = require('discord.js');
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


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);


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

