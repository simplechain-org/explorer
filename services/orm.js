let db = require('../lib/db');
let Sequelize = require("sequelize");
const config = new(require('../config.js'))();

let Block = db.define('blocks',{
    height : {
        type : Sequelize.INTEGER,
        primaryKey: true
    },
    difficulty : {
        type : Sequelize.STRING
    },
    extraData :{
        type : Sequelize.BLOB
    },
    gasLimit :{
        type : Sequelize.INTEGER
    },
    gasUsed:{
        type : Sequelize.INTEGER
    },
    hash : {
        type : 'binary(66)' ,
        primaryKey: true
    },
    logsBloom :{
        type : Sequelize.BLOB
    },
    miner: {
        type : 'binary(42)'
    },
    mixHash : {
        type : 'binary(66)'
    },
    nonce : {
        type : 'binary(18)'
    },
    parentHash : {
        type : 'binary(66)'
    },
    receiptsRoot : {
        type : 'binary(66)'
    },
    sha3Uncles : {
        type : 'binary(66)'
    },
    size : {
        type : Sequelize.INTEGER
    },
    stateRoot : {
        type : 'binary(66)'
    },
    timestamp : {
      type: Sequelize.INTEGER
    },
    totalDifficulty : {
        type : Sequelize.STRING
    },
    transactionsRoot : {
        type : 'binary(66)'
    }
}, {
    freezeTableName: true,
    timestamps: false
})

let Transaction = db.define('transactions', {
    blockHash : {
        type: 'binary(66)'
    },
    blockNumber : {
        type: Sequelize.INTEGER
    },
    hash : {
        type: 'binary(66)',
        primaryKey: true
    },
    from : {
        type: 'binary(42)'
    },
    gas : {
        type : Sequelize.INTEGER
    },
    gasUsed : {
        type : Sequelize.INTEGER
    },
    gasPrice : {
        type : Sequelize.BIGINT
    },
    input :{
        type : Sequelize.BLOB
    },
    nonce : {
        type : Sequelize.INTEGER
    },
    to : {
        type: 'binary(42)'
    },
    transactionIndex : {
        type : Sequelize.INTEGER
    },
    value : {
      type: Sequelize.STRING
    },
    status : {
      type: Sequelize.BOOLEAN
    }
}, {
    freezeTableName: true,
    timestamps: false
});


let TokenConfig = db.define('token_configs',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : {
        type: Sequelize.STRING(10)
    },
    address : {
        type: Sequelize.STRING(42)
    },
    decimals : {
        type: Sequelize.INTEGER
    },
    value :{
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
})


let EventLog = db.define('events',{
    address : {
        type: 'binary(42)'
    },
    blockNumber : {
        type: Sequelize.INTEGER
    },
    transactionHash : {
        type: 'binary(66)',
        primaryKey: true
    },
    transactionIndex : {
        type: Sequelize.INTEGER
    },
    blockHash : {
        type: 'binary(66)'
    },
    logIndex : {
        type: Sequelize.INTEGER
    },
    removed : {
        type: Sequelize.BOOLEAN
    },
    event : {
        type: Sequelize.STRING(20)
    },
    id : {
        type: Sequelize.STRING(20)
    },
    from : {
        type: 'binary(42)'
    },
    to : {
        type: 'binary(42)'
    },
    value : {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
})


let Account = db.define('accounts',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address : {
        type: Sequelize.STRING(42),
        unique : "t_balance_uk"
    },
    tokenAddress : {
        type: Sequelize.STRING(42),
        unique : "t_balance_uk"
    },
    value : {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});

async function initTables(){
    await Block.sync({ force: false});
    await Transaction.sync({ force: false});
    await TokenConfig.sync({ force: false});
    await EventLog.sync({ force: false});
    await Account.sync({ force: false});
    await TokenConfig.findOrCreate({where: {name: config.baseToken}, defaults: {address: config.baseToken,decimals: 18, value: 0}})
    initTableRelation()
}

function initTableRelation(){
    Block.hasMany(Transaction, {foreignKey: 'blockHash', sourceKey: 'hash'});
    Transaction.belongsTo(Block, {foreignKey: 'blockHash', targetKey: 'hash',as: 'block'});
    Transaction.belongsTo(EventLog, {foreignKey: 'hash', targetKey: 'transactionHash',as: 'event'});
    TokenConfig.belongsTo(EventLog, {foreignKey: 'address', targetKey: 'address',as: 'config'});
    Account.belongsTo(TokenConfig, {foreignKey: 'tokenAddress', targetKey: 'address',as: 'config'});
}

initTables();

module.exports = {
    TokenConfig,
    Block,
    Transaction,
    EventLog,
    Account
};
