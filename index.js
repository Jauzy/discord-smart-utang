require('dotenv').config()

const {
    Client,
} = require('discord.js');


const prefix = process.env.PREFIX
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

async function createData(origin, target, amount){
    return await Utang.create({
        utang_origin: origin,
        utang_target: target,
        utang_amount: amount
    })
}


client.once('ready', () => {
    console.log(token, prefix);
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return
    const args = message.content.slice(prefix.length+1).split(/ +/)

    console.log(args, prefix, prefix.length+1)

    if(!args[0]) await message.reply('oi ngapain su, masukin commandnya lah. menghadeh')
    else if (args[0] === 'list') {
        if(args[1] == 'utang'){
            if(!args[2]){
                await message.reply('masukan parameter orang yang dicari! menghadeh. ex: oi list utang joji')
            } else {
                const utang_list = await readData(args[2]) 
                let list = '~ LIST UTANG ~\n'
                await Promise.all(utang_list.map( async utang => {
                    list += `${utang.utang_origin} - ${utang.utang_target} : Rp. ${new Intl.NumberFormat().format(utang.dataValues.total_amount)}\n`
                }))
                await message.reply(list)
            }
        } else {
            const utang_list = await readData() 
            let list = '~ LIST UTANG ~\n'
            await Promise.all(utang_list.map( async utang => {
                list += `${utang.utang_origin} - ${utang.utang_target} : Rp. ${new Intl.NumberFormat().format(utang.dataValues.total_amount)}\n`
            }))
            await message.reply(list)
        }
    } 
    else {
        if(!args[0] || !args[1] || !args[2] || !args[3])
            await message.reply('oi commandnya yang bener la. ex: oi joji utang imam 5000')
        else {
            let origin_to_target = await readData(args[0], args[2])
            let target_to_origin = await readData(args[2], args[0])
            origin_to_target = origin_to_target?.[0]?.dataValues?.total_amount
            target_to_origin = target_to_origin?.[0]?.dataValues?.total_amount 
    
            if (args[1] == 'utang') {
                if (target_to_origin > 0) {
                    if(target_to_origin > parseInt(args[3])){
                        await createData(args[2], args[0], `-${args[3]}`)
                        await message.reply(`utang berhasil ditambahkan`);
                    } else {
                        let utang_left = Math.abs(target_to_origin - parseInt(args[3]))
                        await createData(args[2], args[0], `-${target_to_origin}`)
                        await createData(args[0], args[2], `${utang_left}`)
                        await message.reply(`utang berhasil ditambahkan`);
                    }
                } else {
                    await createData(args[0], args[2], args[3])
                    await message.reply(`utang berhasil ditambahkan`);
                }
            } 
            else if (args[1] == 'bayar') {
                if(origin_to_target < parseInt(args[3])){
                    await createData(args[0], args[2], `-${origin_to_target}`)
                    await createData(args[2], args[0], parseInt(args[3]) - origin_to_target)
                    await message.reply(`utang berhasil dibayar`);
                } 
                else {
                    await createData(args[0], args[2], `-${parseInt(args[3])}`)
                    await message.reply(`utang berhasil dibayar`);
                }
            }
            else {
                await message.reply('commandnya salah oi. menghadeh.')
            }
        }
    }
})

client.login(token);