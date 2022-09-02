let readAll = require('./readAll')	
const moment = require('moment')

module.exports = async (message) => {
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