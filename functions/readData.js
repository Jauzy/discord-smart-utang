const sequelize = require("sequelize");
const db = require("../models/index");
const Utang = db.utang 


module.exports = async (origin, target) => {
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