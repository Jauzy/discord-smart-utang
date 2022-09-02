require('dotenv').config()
const kontrakanMembers = process.env.MEMBERS.split(',')

let createUtang = require('./createUtang')
let printReply = require('../functions/printReply')

module.exports = async(args, message) => {
    let origin = args[1]
    let target = args[2]
    let amount = args[3]
    if(!origin || !target || !amount)
        await message.reply('oi commandnya yang bener la. ex: oi joji utang imam 5000')
    else if (!kontrakanMembers.includes(origin) || !kontrakanMembers.includes(target)) {
        await message.reply('oi ada yg namanya salah 🤡 ('+process.env.MEMBERS+')')
    } else {
        // all command handle
        if (origin == 'all') { 
            // divide the amount of utang to each kontrakanMember
            amount = amount/(kontrakanMembers.length - 1)

            for (const kontrakanMember of kontrakanMembers) {
                // skip all and target member
                if (['all', target].includes(kontrakanMember)) {
                    continue
                } else {
                    await createUtang(message, kontrakanMember, target, amount);
                }
            }
        }
        
        // general command handle
        else { 
            await createUtang(message, origin, target, amount);
        }
    }

    // await printReply(message)
}