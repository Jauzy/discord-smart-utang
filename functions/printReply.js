let readData = require('./readData')

module.exports = async (message, args) => {
    let utang_list
    if(args) utang_list = await readData(args) 
    else utang_list = await readData()
    let list = '~ LIST UTANG ~\n'
    await Promise.all(utang_list.map( async utang => {
        list += `${utang.utang_origin} - ${utang.utang_target} : Rp. ${new Intl.NumberFormat().format(utang.dataValues.total_amount)}\n`
    }))
    await message.reply(list)
}