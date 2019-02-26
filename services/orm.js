let db = require('../lib/db');
let sequelize = require("sequelize");
const config = new (require('../config.js'))();

const {
  INTEGER,
  STRING,
  DATE,
  NOW,
  BLOB,
  BOOLEAN,
  BIGINT
} = sequelize;

let Block = db.define('blocks', {
  height: {
    type: INTEGER,
    primaryKey: true
  },
  difficulty: {
    type: STRING
  },
  extraData: {
    type: BLOB
  },
  gasLimit: {
    type: INTEGER
  },
  gasUsed: {
    type: INTEGER
  },
  hash: {
    type: 'varchar(66)',
    unique: 'block_hash'
  },
  logsBloom: {
    type: BLOB
  },
  miner: {
    type: 'varchar(42)'
  },
  mixHash: {
    type: 'varchar(66)'
  },
  nonce: {
    type: 'varchar(18)'
  },
  parentHash: {
    type: 'varchar(66)'
  },
  receiptsRoot: {
    type: 'varchar(66)'
  },
  totalReward: {
    type: STRING(22)
  },
  uncleReward: {
    type: STRING(22)
  },
  txnFees: {
    type: STRING(40)
  },
  uncleInclusionRewards: {
    type: STRING(22)
  },
  uncleCount: {
    type: INTEGER
  },
  minerReward: {
    type: STRING(22)
  },
  foundation: {
    type: STRING(22)
  }, 
  sha3Uncles: {
    type: 'varchar(66)'
  },
  size: {
    type: INTEGER
  },
  stateRoot: {
    type: 'varchar(66)'
  },
  timestamp: {
    type: INTEGER
  },
  totalDifficulty: {
    type: STRING
  },
  transactionsRoot: {
    type: 'varchar(66)'
  },
  uncles:{type:STRING(133)}
}, {
  freezeTableName: true,
  timestamps: false
});

let Transaction = db.define('transactions', {
  blockHash: {
    type: 'varchar(66)'
  },
  blockNumber: {
    type: INTEGER
  },
  hash: {
    type: 'varchar(66)',
    primaryKey: true
  },
  from: {
    type: 'varchar(42)'
  },
  gas: {
    type: INTEGER
  },
  gasUsed: {
    type: INTEGER
  },
  gasPrice: {
    type: BIGINT
  },
  input: {
    type: BLOB
  },
  nonce: {
    type: INTEGER
  },
  to: {
    type: 'varchar(42)'
  },
  transactionIndex: {
    type: INTEGER
  },
  value: {
    type: STRING
  },
  status: {
    type: BOOLEAN
  }
}, {
  freezeTableName: true,
  timestamps: false
});

let Uncle = db.define('uncles', {
  blockNumber: {type: INTEGER},
  position: {type: INTEGER},

  number: {type: INTEGER},
  difficulty: {type: BIGINT},
  extraData: {type: STRING(66)},
  gasLimit: {type: INTEGER},
  gasUsed: {type: INTEGER},
  hash: {type: STRING(66), primaryKey: true},
  logsBloom: {type: STRING(1024)},
  miner: {type: STRING(42)},
  mixHash: {type: STRING(66)},
  nonce: {type: STRING},
  parentHash: {type: STRING(66)},
  receiptsRoot: {type: STRING(66)},
  sha3Uncles: {type: STRING(66)},
  size: {type: INTEGER},
  stateRoot: {type: STRING(66)},
  timestamp: {type: INTEGER},
  totalDifficulty: {type: BIGINT},
  transactionsRoot: {type: STRING(66)},
  reward: {type: STRING(22)}
}, {
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      name: 'blockNumber',
      fields: ['blockNumber', 'position'],
    },
    {
      name: 'uncleNumber',
      fields: ['number'],
    },
    {
      fields: ['miner'],
    }
  ]
});

let TokenConfig = db.define('token_configs', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: STRING(10)
  },
  address: {
    type: STRING(42)
  },
  decimals: {
    type: INTEGER
  },
  value: {
    type: INTEGER
  }
}, {
  freezeTableName: true,
  timestamps: false
});


let EventLog = db.define('events', {
  address: {
    type: 'varchar(42)'
  },
  blockNumber: {
    type: INTEGER
  },
  transactionHash: {
    type: 'varchar(66)',
    primaryKey: true
  },
  transactionIndex: {
    type: INTEGER
  },
  blockHash: {
    type: 'varchar(66)'
  },
  logIndex: {
    type: INTEGER
  },
  removed: {
    type: BOOLEAN
  },
  event: {
    type: STRING(20)
  },
  id: {
    type: STRING(20)
  },
  from: {
    type: 'varchar(42)'
  },
  to: {
    type: 'varchar(42)'
  },
  value: {
    type: STRING
  }
}, {
  freezeTableName: true,
  timestamps: false
});


let Account = db.define('accounts', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  address: {
    type: STRING(42),
    unique: "t_balance_uk"
  },
  tokenAddress: {
    type: STRING(42),
    unique: "t_balance_uk"
  },
  value: {
    type: STRING
  }
}, {
  freezeTableName: true,
  timestamps: false
});

async function initTables() {
  await Block.sync({force: false});
  await Transaction.sync({force: false});
  await Uncle.sync({force: false});
  await TokenConfig.sync({force: false});
  await EventLog.sync({force: false});
  await Account.sync({force: false});
  await TokenConfig.findOrCreate({
    where: {name: config.baseToken},
    defaults: {address: config.baseToken, decimals: 18, value: 0}
  })
  initTableRelation()
}

function initTableRelation() {
  Block.hasMany(Transaction, {foreignKey: 'blockHash', sourceKey: 'hash'});
  Transaction.belongsTo(Block, {foreignKey: 'blockHash', targetKey: 'hash', as: 'block'});
  Transaction.belongsTo(EventLog, {foreignKey: 'hash', targetKey: 'transactionHash', as: 'event'});
  TokenConfig.belongsTo(EventLog, {foreignKey: 'address', targetKey: 'address', as: 'config'});
  Account.belongsTo(TokenConfig, {foreignKey: 'tokenAddress', targetKey: 'address', as: 'config'});
}

initTables();

module.exports = {
  TokenConfig,
  Block,
  Uncle,
  Transaction,
  EventLog,
  Account
};
