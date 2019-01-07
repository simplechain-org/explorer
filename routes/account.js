var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.prototype.Op;
const db = require('../lib/db');
const {Account,TokenConfig} =  require("../services/orm");
var web3 = require('../lib/web3');
const config = new(require('../config.js'))();

router.get('/:account', function(req, res, next) {
  
  let account = req.params.account;

  let accountParams = {
    include:[{
      model:TokenConfig,
      as:'config',
      where:{
          name :{
              [Op.ne]: config.baseToken
          }
      }
    }],
    where : {
      value : {
        [Op.gt]: 0
      },

      address:req.params.account
    },
    order : [
      ['address','ASC']
    ]
  };

  db.query("select t1.*,t2.`to` as eto,t2.`value` as evalue,t3.name,t3.decimals from transactions as t1 left join events as t2 on t1.hash=t2.transactionHash left join token_configs as t3 on t2.address=t3.address where t1.from=? or t1.to=? or t2.to=? order by t1.blockNumber desc",{
    replacements : [account,account,account],
    type : Sequelize.QueryTypes.SELECT
  }).then(async (data)=>{

      var  accounts  = await Account.findAll(accountParams);

      await TokenConfig.findOne({
          where : {
              name: config.baseToken
          }
      }).then(async (tokenConfig)=> {
          await web3.eth.getBalance(account).then(function(balance){
              accounts.push({address:account,tokenAddress:config.baseToken,value:balance,config:tokenConfig});
          })
      });

      res.render('account', { accounts: accounts, transactions: data,account:req.params.account});
  });

});

module.exports = router;
