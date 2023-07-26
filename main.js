const Discord = require("discord.js");
require('dotenv').config()

console.log(`env config: ${process.env}`);

const client = new Discord.Client();
client.login(process.env.CLIENT_SECRET);

