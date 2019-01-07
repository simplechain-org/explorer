var express = require('express');
var router = express.Router();
var {Block,Transaction,EventLog,TokenConfig} =  require("../services/orm");
var web3 = require('../lib/web3');

router.get('/:hash', function(req, res, next) {
  
  return Transaction.findOne({
    include:[
      {
        model:Block,
        as: 'block'
      },{
        model:EventLog,
        as: 'event'
      }
    ],
		where:{
      hash:req.params.hash
		}
	}).then(async (data)=>{
    var blockNumber = await web3.eth.getBlockNumber();
    var tokenConfig;
    if (data.event){
      tokenConfig = await TokenConfig.findOne({
        where:{
          address:String(data.event.address)
        }
      });
    }
    
    // 更新收据操作已经移到 listenReceipt.js
    // if (data.status === null || data.status === undefined){
    //   var receipt = await web3.eth.getTransactionReceipt(String(data.hash));
    //   data.status = receipt.status;
    //   data.save();
    // }
    res.render('transaction', { transaction: data,blockNumber:blockNumber,tokenConfig:tokenConfig });
  });
});

module.exports = router;
