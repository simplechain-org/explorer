var express = require('express');
var router = express.Router();
var {Block,Transaction} =  require("../services/orm");
var web3 = require('../lib/web3');

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

        var blockNumber = await web3.eth.getBlockNumber();
        res.render('block', { block: data , blockNumber: blockNumber });
  });
});

module.exports = router;
