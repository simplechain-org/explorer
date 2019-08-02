let db = require('../lib/db');
let sequelize = require("sequelize");
const config = new (require('../config.js'))();

const {
  INTEGER,
  STRING,
  DATE,
  NOW,
  BLOB,
  MEDIUMINT,
  SMALLINT,
  BOOLEAN,
  BIGINT,
  DOUBLE,
} = sequelize;


let Block = db.define('t_blocks', {
  number: {
    type: INTEGER,
    primaryKey: true
  },
  difficulty: {
    type: 'varbinary(16)'
  },
  extraData: {
    type: 'binary(32)'
  },
  gasLimit: {
    type: MEDIUMINT
  },
  gasUsed: {
    type: MEDIUMINT
  },
  hash: {
    type: 'binary(32)'
  },
  logsBloom: {
    type: 'varbinary(256)'
  },
  miner: {
    type: 'binary(20)'
  },
  mixHash: {
    type: 'binary(32)'
  },
  nonce: {
    type: 'binary(8)'
  },
  parentHash: {
    type: 'binary(32)'
  },
  receiptsRoot: {
    type: 'binary(32)'
  },
  sha3Uncles: {
    type: 'binary(32)'
  },
  unclesCount: {
    type: SMALLINT
  },
  uncleInclusionRewards: {
    type: DOUBLE
  },
  txnFees: {
    type: DOUBLE
  },
  minerReward: {
    type: DOUBLE
  },
  foundation: {
    type: DOUBLE
  },
  size: {
    type: MEDIUMINT
  },
  stateRoot: {
    type: 'binary(32)'
  },
  timestamp: {
    type: INTEGER
  },
  totalDifficulty: {
    type: 'varbinary(22)',
  },
  transactionsRoot: {
    type: 'binary(32)'
  }
}, {
  freezeTableName: true,
  timestamps: false
});

let Transaction = db.define('t_transactions', {
  blockHash: {
    type: 'binary(32)',
  },
  blockNumber: {
    type: INTEGER
  },
  hash: {
    type: 'binary(32)',
    primaryKey: true
  },
  from: {
    type: 'binary(20)',
  },
  gas: {
    type: MEDIUMINT
  },
  gasUsed: {
    type: MEDIUMINT
  },
  gasPrice: {
    type: BIGINT
  },
  input: {
    type: 'varbinary(50000)'
  },
  nonce: {
    type: 'binary(8)'
  },
  to: {
    type: 'binary(20)',
  },
  transactionIndex: {
    type: SMALLINT
  },
  value: {
    type: 'varbinary(32)'
  },
  status: {
    type: 'tinyint(1)'
  }
}, {
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      fields: ['blockNumber'],
    },
    {
      fields: ['from'],
    },
    {
      fields: ['to'],
    }
  ]
});
//
let Uncle = db.define('t_uncles', {
  blockNumber: {
    type: INTEGER
  },
  number: {
    type: INTEGER
  },
  difficulty: {
    type: 'varbinary(16)'
  },
  extraData: {
    type: 'binary(32)'
  },
  gasLimit: {
    type: MEDIUMINT
  },
  gasUsed: {
    type: MEDIUMINT
  },
  hash: {
    type: 'binary(32)',
    primaryKey: true
  },
  logsBloom: {
    type: 'varbinary(256)'
  },
  miner: {
    type: 'binary(20)'
  },
  mixHash: {
    type: 'binary(32)'
  },
  nonce: {
    type: 'binary(8)'
  },
  parentHash: {
    type: 'binary(32)'
  },
  receiptsRoot: {
    type: 'binary(32)'
  },
  sha3Uncles: {
    type: 'binary(32)'
  },
  size: {
    type: MEDIUMINT
  },
  stateRoot: {
    type: 'binary(32)'
  },
  timestamp: {
    type: INTEGER
  },
  transactionsRoot: {
    type: 'binary(32)'
  },
  uncleIndex: {
    type: SMALLINT
  },
  reward: {type: DOUBLE}
}, {
  freezeTableName: true,
  timestamps: false
});


async function initTables() {
  await Block.sync({force: false});
  await Transaction.sync({force: false});
  await Uncle.sync({force: false});
}


initTables();

module.exports = {
  Block,
  Uncle,
  Transaction,
};
