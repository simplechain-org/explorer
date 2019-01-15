var express = require('express');
var router = express.Router();
var { Block, Transaction, Uncle } = require("../services/orm");
var web3 = require('../lib/web3');
var blockReward = require('../utils/blockReward');
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
    let reward = blockReward.getBlockReward(data)
    let arrUncles = data.uncles.split(',')
    let uncleReward = 0
    for (let i = 0; i < arrUncles.length; i++) {
      let uncle = await Uncle.findOne({
        where: {
          hash: arrUncles[i]
        }
      })
      uncleReward += blockReward.getUncleReward(uncle.number, uncle.blockNumber)
    }

    res.render('block', {
      block: data,
      blockNumber,
      reward,
      uncleReward
    });
  });
});

module.exports = router;
