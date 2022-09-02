let readData = require('../functions/readData')

let createUtang = require('./createUtang')
// let createBayar = require('./createBayar')

module.exports = async(args, message) => {
    let origin = args[1]
    let origin2 = args[2]
    let target = args[4]

    if(!origin || !origin2 || !target){

    } else {
        let saldo = await readData(origin, origin2)
        let to_merge = await readData(origin2, target)
    
        if(saldo && to_merge){
            saldo = saldo[0].dataValues.total_amount
            to_merge = to_merge[0].dataValues.total_amount
    
            let selisih = saldo - to_merge
            let nominal = 0
    
            if(selisih < 0) nominal = Math.abs(saldo)
            else nominal = to_merge
            await createUtang(message, origin, target, nominal)
            await createUtang(message, origin2, origin, nominal)
            await createUtang(message, target, origin2, nominal)
            // origin utang target amount
        }
    } 
}