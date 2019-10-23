const web3 = require('../lib/web3');
const db = require('../lib/db');
const Sequelize = require("sequelize");
const config = new (require('../config.js'))();
const {sendMessage} = require("../mq/sender");

let syncReceipt = () => {
    db.query("select cast(hash as char) hash,blockNumber,`from`,`to`,cast(`value` as char) value from transactions where gasUsed is NULL order by blockNumber limit 200",{
        replacements: [],
        type: Sequelize.QueryTypes.SELECT
    }).then(result => {

        for (let i = 0 ; i < result.length; i++){
            let data = result[i];

            web3.eth.getTransactionReceipt(String(data.hash)).then(receipt => {
                db.query(`update t_transactions set gasUsed=${receipt.gasUsed},status=${receipt.status} where hash=${receipt.transactionHash}`,{
                    replacements: [],
                    type: Sequelize.QueryTypes.UPDATE
                }).then((r) => {
                    data.status = receipt.status;
                    data.name = config.baseToken;
                    data.decimals = 18;

                    //推送消息至MQ
                    if (config.mq.enable && receipt && receipt.logs.length == 0){
                        sendMessage(config.mq.key,JSON.stringify(data));
                    }
                }).catch(e => {
                    console.log(e)
                })
            })
        }

        setTimeout(() => {
            syncReceipt();
        },config.refreshingTime)

    }).catch(e => {
        console.log(e)
    })
}

module.exports = syncReceipt
