var express = require('express');
var router = express.Router();
var {Block,Transaction} =  require("../services/orm");
var web3 = require('../lib/web3');
var blockReward = require('../utils/blockReward');
router.get('/:block', function(req, res, next) {

  var paramter;
  if (req.params.block.startsWith('0x')){
    paramter = {hash:req.params.block};
  } else {
    paramter = {height:req.params.block};
  }

  return Block.findOne({
        include:[
            {
                model:Transaction
            }
        ],
		where:paramter
	}).then(async (data)=>{
    let blockNumber = await web3.eth.getBlockNumber();
    let reward = blockReward.getBlockReward(data)
    res.render('block', { 
      block: data, 
      blockNumber,
      reward
    });
  });
});

module.exports = router;
