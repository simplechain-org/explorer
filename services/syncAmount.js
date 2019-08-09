const web3 = require('../lib/web3');
const db = require('../lib/db');
const Sequelize = require("sequelize");

let syncAmount = async () => {

    db.query(`
        insert into t_address_amount(address)
        select distinct address from (
            select distinct cast(miner as char) address from blocks
            union 
            select distinct cast(miner as char) from uncles
            union
            select cast(\`from\` as char) from transactions
            union 
            select cast(\`to\` as char) from transactions
        ) t where not exists (select 1 from t_address_amount t1 where cast(t.address as char) = cast(t1.address as char)) and address is not null

    `,{
        replacements: [],
        type: Sequelize.QueryTypes.INSERT
    }).then(result => {
        db.query("select * from t_address_amount",{
            replacements: [],
            type: Sequelize.QueryTypes.SELECT
        }).then(async datas => {
            for (let i = 0 ; i<datas.length; i++){
                await web3.eth.getBalance(datas[i].address).then(balance => {
                    let amount = web3.utils.fromWei(balance,'ether').split(".")[0];
                    let change = Number(amount) - Number(datas[i].amount);
                    db.query("update t_address_amount set amount=?,`change`=? where address=?",{
                        replacements: [amount,change,datas[i].address],
                        type: Sequelize.QueryTypes.UPDATE
                    }).catch(e => {
                        console.log(e);
                    })
                })
            }
            console.log("update end")
        })
    }).catch(e => {
        console.log(e)
    })
}

syncAmount();