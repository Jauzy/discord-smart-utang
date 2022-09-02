let printReply = require('../functions/printReply')

module.exports = async(args, message,) => {
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