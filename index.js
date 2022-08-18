require('dotenv').config()
const moment = require('moment')

const {
    Client,
} = require('discord.js');


const prefix = process.env.PREFIX
const kontrakanMembers = process.env.MEMBERS.split(',')
const token = process.env.TOKEN.toString()

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
});

const sequelize = require("sequelize");

const db = require("./models/index");
db.sequelize.sync().then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Utang = db.utang 

async function readAll(){
    return await Utang.findAll()
}

async function readData(origin, target) {
    let where = {}
    if(origin)
        where = {utang_origin: origin}
    if(target) where = {...where, utang_target: target}
    return await Utang.findAll({
        attributes: [
            'utang_origin', 'utang_target', [sequelize.fn('sum', sequelize.col('utang_amount')), 'total_amount'],
        ],
        where,
        order: [
            ['utang_origin', 'ASC'],
            ['utang_target', 'ASC'],
        ],
        group: ['utang_origin', 'utang_target']
    })
}

async function createData(message,origin, target, amount){
    let data = await Utang.create({
        utang_origin: origin,
        utang_target: target,
        utang_amount: amount,
        utang_issuedby: message.member.user.username,
        utang_issuedchannel: message.member.guild.name
    })
    return data
}

async function printReply(message, args){
    let utang_list
    if(args) utang_list = await readData(args) 
    else utang_list = await readData()
    let list = '~ LIST UTANG ~\n'
    await Promise.all(utang_list.map( async utang => {
        list += `${utang.utang_origin} - ${utang.utang_target} : Rp. ${new Intl.NumberFormat().format(utang.dataValues.total_amount)}\n`
    }))
    await message.reply(list)
}

async function printLogs(message){
    let utang_list = await readAll()
    let list = '~ LOG UTANG ~\n'
    await message.reply(list)
    await Promise.all(utang_list.map( async utang => {
        let cmd = 'bayar'
        if(utang.total_amount > 0) cmd = 'utang'
        await message.reply(`Transaction '${cmd.toUpperCase()}' from ${utang.utang_origin} to ${utang.utang_target} Rp. ${new Intl.NumberFormat().format(utang.dataValues.utang_amount)} on ${moment(utang.createdAt).locale('id').format('Do MMMM YYYY h:mm')}, issued by ${utang.utang_issuedby} on ${utang.utang_issuedchannel}\n`)
    }))
    // await message.reply(list)
}

async function createUtang(message, origin, target, args) {
    let origin_to_target = await readData(origin, target)
    let target_to_origin = await readData(target, origin)
    origin_to_target = origin_to_target?.[0]?.dataValues?.total_amount
    target_to_origin = target_to_origin?.[0]?.dataValues?.total_amount 

    if (args[1] == 'utang') {
        if (target_to_origin > 0) {
            if(target_to_origin > parseInt(args[3])){
                await createData(message,target, origin, `-${args[3]}`)
                await message.reply(`${origin} utang ${target} ${args[3]} berhasil ditambahkan`);
            } else {
                let utang_left = Math.abs(target_to_origin - parseInt(args[3]))
                await createData(message,target, origin, `-${target_to_origin}`)
                await createData(message,origin, target, `${utang_left}`)
                await message.reply(`${origin} utang ${target} ${args[3]} berhasil ditambahkan`);
            }
        } else {
            await createData(message,origin, target, args[3])
            await message.reply(`${origin} utang ${target} ${args[3]} berhasil ditambahkan`);
        }
    } 
    else if (args[1] == 'bayar') {
        if(origin_to_target < parseInt(args[3])){
            await createData(message,origin, target, `-${origin_to_target}`)
            await createData(message,target, origin, parseInt(args[3]) - origin_to_target)
            await message.reply(`utang ${args[3]} milik ${target} berhasil dibayar oleh ${origin}`);
            printReply(message)
        } 
        else {
            await createData(message,origin, target, `-${parseInt(args[3])}`)
            await message.reply(`utang ${args[3]} milik ${target} berhasil dibayar oleh ${origin}`);
            printReply(message)
        }
    }
    else {
        await message.reply('commandnya salah oi. menghadeh.')
    }
}

client.once('ready', () => {
    console.log(token, prefix);
});

client.on('message', async message => {
    const fromDiscord = message.content.toLowerCase();
    if (!fromDiscord.startsWith(prefix) || message.author.bot) return
    let args = message.content.slice(prefix.length+1).split(/ +/)

    if(!args[0]) await message.reply('oi ngapain su, masukin commandnya lah. menghadeh')
    // else if(args[0] == 'logs'){
    //     printLogs(message)
    // }
    else if (args[0] === 'list') {
        if(args[1] == 'utang'){
            if(!args[2]){
                await message.reply('masukan parameter orang yang dicari! menghadeh. ex: oi list utang joji')
            } else {
                printReply(message, args[2])
            }
        } else {
            printReply(message)
        }
    } 
    else {
        if(!args[0] || !args[1] || !args[2] || !args[3])
            await message.reply('oi commandnya yang bener la. ex: oi joji utang imam 5000')
        else if (!kontrakanMembers.includes(args[0]) || !kontrakanMembers.includes(args[2])) {
            await message.reply('oi ada yg namanya salah 🤡 (mike,joji,rery,imam,syafiq,akbar)')
        }
        else {
            // all command handle
            if (args[0] === 'all') { 
                // divide the amount of utang to each kontrakanMember
                args[3] = args[3]/(kontrakanMembers.length - 1)

                for (const kontrakanMember of kontrakanMembers) {
                    // skip all and target member
                    if (['all', args[2]].includes(kontrakanMember)) {
                        continue
                    } else {
                        await createUtang(message, kontrakanMember, args[2], args);
                    }
                }
            }
            
            // general command handle
            else {
                await createUtang(message, args[0], args[2], args);
            }
        }

        await printReply(message)
    }
})

client.login(token);