const db = require("../models/index");
const Utang = db.utang 

module.exports = async (message,origin, target, amount) => {
    let data = await Utang.create({
        utang_origin: origin,
        utang_target: target,
        utang_amount: amount,
        utang_issuedby: message.member.user.username,
        utang_issuedchannel: message.member.guild.name
    })
    return data
}