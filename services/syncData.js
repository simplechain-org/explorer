const web3 = require('../lib/web3');
const db = require('../lib/db');
const Sequelize = require("sequelize");

function listenBlockTransactions(blockNumber) {

    web3.eth.getBlock(blockNumber, true).then(async (result) => {
        if (result === undefined || result === null){
            return false;
        }

        if (result.transactions != null && result.transactions.length > 0){

            let sql = "replace into t_transactions(blockHash,blockNumber,`from`,gas,gasPrice,hash,input,nonce,`to`,transactionIndex,value) values ";

            for(let i = 0 ; i < result.transactions.length ; i++){
                let transaction = result.transactions[i];
                if (transaction.input === '0x') {
                    transaction.input = '0x0'
                }

                if (transaction.input.length > 50000) {
                    transaction.input = '0x0'
                }

                if (transaction.to === null || transaction.to === undefined){
                    transaction.to = '0x0';
                }

                sql += `(${transaction.blockHash},'${transaction.blockNumber}',${transaction.from},'${transaction.gas}',
                        '${transaction.gasPrice}',${transaction.hash},${transaction.input},${transaction.nonce},
                        ${transaction.to},'${transaction.transactionIndex}','${transaction.value}')`;
                if (i != result.transactions.length-1){
                    sql += ",";
                }
            }


            db.query(sql,{
                replacements: [],
                type: Sequelize.QueryTypes.INSERT
            }).catch(e => {
                console.log(455, e);
                throw e;
            })
        }

    }).catch(e => {
        console.log('getTransactions error:',blockNumber,e)
    })
}

module.exports = {
    listenBlockTransactions: listenBlockTransactions
}

