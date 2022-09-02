const db = require("../models/index");
const Utang = db.utang 

module.exports = async () => {
    return await Utang.findAll()
} 