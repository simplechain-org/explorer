var {Transaction} =  require("../services/orm");
var web3 = require('../lib/web3');
const Sequelize = require("sequelize");
const config = new(require('../config.js'))();
const {sendMessage} = require("../mq/sender");
const db = require('../lib/db');

let listenReceipt = async function(){

    await db.query("select t1.blockNumber,t1.hash,t1.from,t1.to,t1.value,t2.to as eto,t2.event,t2.value as evalue,t3.timestamp,t4.decimals,t4.name from transactions t1 left join events t2 on t1.hash=t2.transactionHash left join blocks t3 on t1.blockHash = t3.hash left join token_configs t4 on t2.address=t4.address where t1.status is null order by t1.blockNumber asc limit ?,?",{
        replacements : [0,20],
        type : Sequelize.QueryTypes.SELECT
    }).then((rows)=>{
        rows.forEach(async function(data){
            var receipt = await web3.eth.getTransactionReceipt(String(data.hash));
            await Transaction.update({status:receipt.status,gasUsed:receipt.gasUsed},{where:{hash:data.hash}});
            data.status = receipt.status;

            if (data.name === null || data.name === undefined){
                data.name = config.baseToken;
                data.decimals = 18;
            }
            let event = data.event;
            //推送消息至MQ
            if (config.mq.enable && receipt && (event === null || event === undefined || event == 'Transfer')){
                await sendMessage(config.mq.key,JSON.stringify(data));
            }
        })
    });
}

var exporter = function() {
    setInterval(
      () => {
        listenReceipt();
      },config.refreshingTime);
}

module.exports = exporter;
