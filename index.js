require('dotenv').config()

const {
    Client,
    Collection
} = require('discord.js');

const {
    prefix
} = require('./config.json');

const token = process.env.TOKEN.toString()

// console.log(token)

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
});

const fs = require('fs')
const fsPromises = fs.promises;
const path = require('path');
// client.commands = new Collection()

// const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
// for(const file of commandFiles){
//     const command = require(`./commands/${file}`)
//     client.commands.set(command.name, command)
// }

async function readingJSON () {
    const test = await fsPromises.readFile('./data_utang.json')

    return JSON.parse(test)
}

async function writeJSON (data) {
    try {
        console.log("data :", data)
        const pre_data = JSON.stringify(data)
        console.log("pre_data :", pre_data)
        const test = await fsPromises.writeFile('./data_utang.json', pre_data)
        console.log("test :", test)
        return test
    } catch (error) {
        console.log(error)
        return error
    }
   
}

let utang_list = {}

client.once('ready', () => {
    console.log(token, prefix);
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return
    const args = message.content.slice(prefix.length).split(/ +/) 

    const utang_list = await readingJSON()
    
    if (args[0] === 'list') {
        let list = '\n'
        console.log(Object.keys(utang_list))
        Object.keys(utang_list).forEach(key => {
            let keys = Object.keys(utang_list[key])
            keys.map(keyd => {
                list += `${key} ke ${keyd} => Rp. ${new Intl.NumberFormat().format(utang_list[key][keyd])}\n`
            })
        })
        await message.reply(list)
    } else {
        if (!utang_list[args[0]]) utang_list[args[0]] = {}
        if (!utang_list[args[0]][args[2]]) utang_list[args[0]][args[2]] = 0
        if (!utang_list[args[2]]) utang_list[args[2]] = {}
        if (!utang_list[args[2]][args[0]]) utang_list[args[2]][args[0]] = 0
        if (args[1] == 'utang') {
            if (utang_list[args[2]][args[0]] > 0) {
                utang_list[args[0]][args[2]] = Math.abs(parseInt(args[3]) - utang_list[args[2]][args[0]])
                utang_list[args[2]][args[0]] = 0
                await message.reply(`utang berhasil ditambahkan, ${args[0]} sekarang memiliki utang sebesar Rp. ${new Intl.NumberFormat().format(utang_list[args[0]][args[2]])}`);
            } else {
                utang_list[args[0]][args[2]] += parseInt(args[3])
                await message.reply(`utang berhasil ditambahkan, ${args[0]} memiliki utang sebesar Rp. ${new Intl.NumberFormat().format(utang_list[args[0]][args[2]])}`);
            }
        } else if (args[1] == 'bayar') {
            if (utang_list[args[0]][args[2]] < parseInt(args[3])) {
                utang_list[args[2]][args[0]] = parseInt(args[3]) - utang_list[args[0]][args[2]]
                utang_list[args[0]][args[2]] = 0
                await message.reply(`utang berhasil dibayar, ${args[2]} sekarang memiliki utang sebesar Rp. ${new Intl.NumberFormat().format(utang_list[args[2]][args[0]])}`);
            } else {
                utang_list[args[0]][args[2]] = utang_list[args[0]][args[2]] - parseInt(args[3])
                await message.reply(`utang berhasil dibayar, ${args[0]} masih memiliki utang sebesar Rp. ${new Intl.NumberFormat().format(utang_list[args[0]][args[1]])}`);
            }
        }
    }

    const check = await writeJSON(utang_list)
    console.log(check)
})

client.login(token);