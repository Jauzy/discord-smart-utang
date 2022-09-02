require('dotenv').config()


const {
    Client,
} = require('discord.js');


const prefix = process.env.PREFIX
const token = process.env.TOKEN.toString()

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
}); 

const db = require("./models/index");
db.sequelize.sync().then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


client.once('ready', () => {
    console.log(token, prefix);
});

let listUtang = require('./commands/listUtang')
let generateUtang = require('./commands/generateUtang')
let createBayar = require('./commands/createBayar')
let mergeUtang = require('./commands/mergeUtang')

client.on('message', async message => {
    const fromDiscord = message.content.toLowerCase();
    if (!fromDiscord.startsWith(prefix) || message.author.bot) return
    let args = message.content.slice(prefix.length+1).split(/ +/)
    let command =  args[0]

    if(!command) await message.reply('oi ngapain su, masukin commandnya lah. menghadeh')
    else if (command == 'list') {
        listUtang(args, message)
    } 
    else if(command == 'utang') {
        generateUtang(args, message)
    }
    else if(command == 'bayar') {
        createBayar(args, message)
    }
    else if(command == 'merge') {
        mergeUtang(args, message)
    }
})

client.login(token);