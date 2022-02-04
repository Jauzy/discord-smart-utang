
module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define("utangs", {
        utang_id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        utang_origin : {
            type: Sequelize.STRING,
            allowNull: false
        },
        utang_target: {
            type: Sequelize.STRING, 
        },
        utang_amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        utang_issuedby: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        utang_issuedchannel: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {});
    return Model;
};