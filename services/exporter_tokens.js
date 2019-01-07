
var web3 = require('../lib/web3');
var abi = require("../abi/erc20");
const config = new(require('../config.js'))();
var {TokenConfig,EventLog,Account} =  require("../services/orm");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var baseToken = config.baseToken;

async function processLog(event,contract){
  var from,to;

  if (event.event === 'Transfer'){
    from = event.returnValues._from.toLowerCase();
    to = event.returnValues._to.toLowerCase();
  } else if (event.event === 'Approval'){
    from = event.returnValues._owner.toLowerCase();
    to = event.returnValues._spender.toLowerCase();
  }

  await EventLog.findOrCreate({
    where : {
      transactionHash : event.transactionHash
    },defaults : {
      address : event.address.toLowerCase(),
      blockNumber : event.blockNumber,
      transactionHash : event.transactionHash,
      transactionIndex : event.transactionIndex,
      blockHash : event.blockHash,
      logIndex : event.logIndex,
      removed : event.removed,
      event : event.event,
      id : event.id,
      from : from,
      to : to,
      value : event.returnValues._value
    }
  }).spread(async(eventLog,created) => {
    if(created && event.event === 'Transfer'){

      // await contract.methods.balanceOf(from).call().then(function(balance){
      //     //更新发款方帐户
      //     Account.findOrCreate({
      //       where : {
      //         [Op.and]:{
      //           address : from,
      //           tokenAddress : event.address.toLowerCase()
      //         }
      //       },
      //       defaults : {address:from,tokenAddress:event.address.toLowerCase(),value:balance}
      //     }).spread((account,created) => {
      //       if (!created){
      //         account.value=balance;
      //         account.save();
      //       }
      //     });
      // });

      // await contract.methods.balanceOf(to).call().then(function(balance){
      //   //更新收款方帐户
      //   Account.findOrCreate({
      //     where : {
      //       [Op.and]:{
      //         address : to,
      //         tokenAddress : event.address.toLowerCase()
      //       }
      //     },
      //     defaults : {address:to,tokenAddress:event.address.toLowerCase(),value:balance}
      //   }).spread((account,created) => {
      //     if (!created){
      //       account.value=balance;
      //       account.save();
      //     }
      //   });
      // });
    }
  })
}

var exporter = function() {

  setInterval(
     () =>  {
      TokenConfig.findAll({
        where : {
          name : {
            [Op.not]:baseToken
          }
        }
      }).then(configs => {

        configs.forEach(async function(config){
          var value = config.value;
          var blockNumber = await web3.eth.getBlockNumber();
          var toBlock =  value + 10 > blockNumber ? blockNumber : value + 10;
          var contract = new web3.eth.Contract(abi,config.address);

          contract.getPastEvents("allEvents", {
            fromBlock: value,
            toBlock: toBlock
          },  async function (error, events) {
             for(event of events){
                 await processLog(event,contract);
              }
          });

          TokenConfig.update({
            value : toBlock
          },{
            where:{
              address : config.address
            }
          });

        })
      })
    },config.refreshingTime);
}

module.exports = exporter;
