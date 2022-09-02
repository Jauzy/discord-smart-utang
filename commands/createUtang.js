let readData = require('../functions/readData')
let createData = require('../functions/createData')

let printReply = require('../functions/printReply')

module.exports = async (message, origin, target, amount) => {
    let origin_to_target = await readData(origin, target)
    let target_to_origin = await readData(target, origin)
    origin_to_target = origin_to_target?.[0]?.dataValues?.total_amount
    target_to_origin = target_to_origin?.[0]?.dataValues?.total_amount 
 

    if (target_to_origin > 0) {
        if(target_to_origin > parseInt(amount)){
            await createData(message,target, origin, `-${amount}`)
            await message.reply(`${origin} utang ${target} ${amount} berhasil ditambahkan`);
        } else {
            let utang_left = Math.abs(target_to_origin - parseInt(amount))
            await createData(message,target, origin, `-${target_to_origin}`)
            await createData(message,origin, target, `${utang_left}`)
            await message.reply(`${origin} utang ${target} ${amount} berhasil ditambahkan`);
        }
    } else {
        await createData(message,origin, target, amount)
        await message.reply(`${origin} utang ${target} ${amount} berhasil ditambahkan`);
    } 

    printReply(message, origin)
}