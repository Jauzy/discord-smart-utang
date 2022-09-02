let readData = require('../functions/readData')
let createData = require('../functions/createData')
let printReply = require('../functions/printReply')

module.exports = async (args, message) => {
    let origin = args[1]
    let target = args[2]
    let amount = args[3]

    let origin_to_target = await readData(origin, target)
    let target_to_origin = await readData(target, origin)
    origin_to_target = origin_to_target?.[0]?.dataValues?.total_amount
    target_to_origin = target_to_origin?.[0]?.dataValues?.total_amount 

    if(origin_to_target < parseInt(amount)){
        await createData(message,origin, target, `-${origin_to_target}`)
        await createData(message,target, origin, parseInt(amount) - origin_to_target)
        await message.reply(`utang ${amount} milik ${target} berhasil dibayar oleh ${origin}`);
    } 
    else {
        await createData(message,origin, target, `-${parseInt(amount)}`)
        await message.reply(`utang ${amount} milik ${target} berhasil dibayar oleh ${origin}`);
    }
    printReply(message, origin)
}