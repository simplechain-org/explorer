const web3 = require('../lib/web3');
const config = new (require('../config.js'))();
const { Block, Uncle, Transaction, TokenConfig, Account } = require("../services/orm");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const baseToken = config.baseToken;
const blockReward = require('../utils/blockReward');
const PERCENT_OF_FOUNDATION = 0.05;

async function listenBlock(blockNumber) {
  await web3.eth.getBlock(blockNumber, true, async function (error, result) {
    if (!error) {

      if(result.number%10 === 0)
        console.log("Get block ", result.number);

      let reward = blockReward.getConstReward(result.number)
      var blockValue = {
        height: result.number,
        difficulty: result.difficulty,
        extraData: result.extraData,
        gasLimit: result.gasLimit,
        gasUsed: result.gasUsed,
        hash: result.hash,
        logsBloom: result.logsBloom,
        miner: result.miner.toLowerCase(),
        mixHash: result.mixHash,
        nonce: result.nonce,
        parentHash: result.parentHash,
        receiptsRoot: result.receiptsRoot,
        uncleCount: 0,
        sha3Uncles: result.sha3Uncles,
        size: result.size,
        stateRoot: result.stateRoot,
        timestamp: result.timestamp,
        totalDifficulty: result.totalDifficulty,
        transactionsRoot: result.transactionsRoot,
        uncles: result.uncles.join(","),
        minerReward: reward * (1 - PERCENT_OF_FOUNDATION),
        foundation: reward * PERCENT_OF_FOUNDATION,
        txnFees: blockReward.getGasInBlock(result.transactions),
      };

      await web3.eth.getBlockUncleCount(result.number, async (e, n) => {
        blockValue.uncleCount = n;
        blockValue.uncleInclusionRewards = blockReward.getRewardForUncle(result.number, n)
        blockValue.totalReward = blockValue.uncleInclusionRewards + blockValue.txnFees + reward
        blockValue.uncleReward = 0
        if (n > 0) {
          for (let i = 0; i < n; i++) {
            await web3.eth.getUncle(result.number, i, true, async (e, b) => {
              if (e == null) {
                b.blockNumber = result.number;
                b.position = i;
                b.reward = blockReward.getUncleReward(b.number, b.blockNumber)
                blockValue.uncleReward += b.reward
                await Uncle.findOrCreate(
                  {
                    where: {
                      blockNumber: result.number,
                      position: i
                    },
                    defaults: b
                  }
                ).spread(async (e, created) => {
                    if (!created) {
                      Uncle.update(b, {
                        where: {
                          blockNumber: result.number,
                          position: i
                        }
                      });
                    }
                  })
              }
            }).catch((e) => {
              console.log("getUncle", e)
            })
          }
          Block.update({uncleReward: blockValue.uncleReward}, { where: { height: result.number } })
        }
      });

      await Block.findOrCreate({
        where: {
          height: result.number
        },
        defaults: blockValue
      }).spread(async (block, created) => {

        if (!created) {
          Block.update(blockValue, { where: { height: result.number } })
        }

        await result.transactions.forEach(async function (transaction) {
          await Transaction.findOrCreate({
            where: {
              hash: transaction.hash.toLowerCase()
            },
            defaults: {
              blockHash: transaction.blockHash,
              blockNumber: transaction.blockNumber,
              from: transaction.from.toLowerCase(),
              gas: transaction.gas,
              gasPrice: transaction.gasPrice,
              hash: transaction.hash.toLowerCase(),
              input: transaction.input,
              nonce: transaction.nonce,
              to: transaction.to,
              transactionIndex: transaction.transactionIndex,
              value: transaction.value.toString()
            }
          }).spread(async (tx, c1) => { });
        })
      }).catch((e) => {
        console.log("transactions", e)
      });

      // await Transaction.findOrCreate({
      //    where:{
      //      hash : transaction.hash
      //    },
      //    defaults:{
      //      blockHash: transaction.blockHash,
      //      blockNumber: transaction.blockNumber,
      //      from: transaction.from.toLowerCase(),
      //      gas: transaction.gas,
      //      gasPrice: transaction.gasPrice,
      //      hash: transaction.hash.toLowerCase(),
      //      input: transaction.input,
      //      nonce: transaction.nonce,
      //      to: transaction.to.toLowerCase(),
      //      transactionIndex: transaction.transactionIndex,
      //      value: transaction.value.toString(),
      //    }
      //  }).spread(async (tx,c1) => {
      //
      //    if(c1){
      //      var from = transaction.from.toLowerCase();
      // var to = transaction.to.toLowerCase();

      // 更新发款方帐户
      // await web3.eth.getBalance(from).then(function(balance){
      //   Account.findOrCreate({
      //     where : {
      //       [Op.and]:{
      //         address : from,
      //         tokenAddress : baseToken
      //       }
      //     },
      //     defaults : {address:from,tokenAddress: baseToken ,value:balance}
      //   }).spread((account,c2) => {
      //     if (!c2){
      //       account.value=balance;
      //       account.save();
      //     }
      //   });
      // });

      // 更新收款方帐户
      // await web3.eth.getBalance(to).then(function(balance){
      //   Account.findOrCreate({
      //     where : {
      //       [Op.and]:{
      //         address : to,
      //         tokenAddress : baseToken
      //       }
      //     },
      //     defaults : {address:to,tokenAddress: baseToken,value:balance}
      //   }).spread((account,created) => {
      //     if (!created){
      //       account.value=balance;
      //       account.save();
      //     }
      //   });
      // });
      //   }
      // })



    } else
      console.error(error);
  })
}

var exporter = function () {

  setInterval(
    () => {
      TokenConfig.findOne({
        where: {
          name: baseToken
        }
      }).then(async config => {
        var value = config.value;

        web3.eth.getBlockNumber(async function (error, result) {

          if (value < result) {
            var blockNumber;
            for (var i = value; i < value + 20; i++) {
              blockNumber = i;
              if (i > result) break;
              await listenBlock(i);
            }

            TokenConfig.update({
              value: result - 20 > blockNumber ? blockNumber : result - 20
            }, {
                where: {
                  name: baseToken
                }
              });
          }
        })
      });

      // web3.eth.subscribe('pendingTransactions', function(error, result){
      //     if (!error) {
      //         console.log("Transactions matching 1");
      //     }
      //     console.log(result);
      // })
      // .on("data", function(trxData){
      //     console.log("Transactions matching 2");
      //     console.log(trxData);
      // });
    }, config.refreshingTime);


}

module.exports = exporter;
