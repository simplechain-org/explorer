var express = require('express');
var router = express.Router();
var { Block, Transaction, Uncle } = require("../services/orm");
var web3 = require('../lib/web3');
var blockReward = require('../utils/blockReward');
const PERCENT_OF_FOUNDATION = 0.05;

router.get('/:block', function (req, res, next) {

  var paramter;
  if (req.params.block.startsWith('0x')) {
    paramter = { hash: req.params.block };
  } else {
    paramter = { height: req.params.block };
  }

  return Block.findOne({
    include: [
      {
        model: Transaction,
      }
    ],
    where: paramter
  }).then(async (data) => {
    let blockNumber = await web3.eth.getBlockNumber();
    if (!data.totalReward) {
      let reward = blockReward.getConstReward(data.height)
      let txnFees = blockReward.getGasInBlock(data.transactions)
      let uncleReward = 0
      for (let i = 0; i < data.uncleCount; i++) {
        let uncle = await Uncle.findOne({
          where: {
            hash: data.uncles.split(',')[i]
          }
        })
        uncleReward += uncle?blockReward.getUncleReward(uncle.number, uncle.blockNumber):0
      }
      let uncleInclusionRewards = blockReward.getRewardForUncle(data.height,data.uncleCount)
      
      let totalReward = reward + txnFees + uncleInclusionRewards
      let rewardDate = {totalReward, uncleInclusionRewards, minerReward: reward*(1-PERCENT_OF_FOUNDATION), uncleReward, txnFees, foundation: reward*PERCENT_OF_FOUNDATION }
      
      Block.update(rewardDate, {
        where:{
          height : data.height
        }
      })
      Object.assign(data, rewardDate)
    }

    res.render('block', {
      block: data,
      blockNumber
    });
  });
});

module.exports = router;
