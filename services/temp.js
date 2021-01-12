const web3 = require('../lib/web3');
const db = require('../lib/db');
const Sequelize = require("sequelize");
const config = new (require('../config.js'))();
const {listenBlockTransactions} = require('./syncData')
const blockReward = require('../utils/blockReward');
const PERCENT_OF_FOUNDATION = 0.05;

let listenBlock = async (blockNumber) => {

    if (blockNumber % 10 === 0) {
        console.log("Get block ", blockNumber);
    }

    let currentHeight = await web3.eth.getBlockNumber();


    if (blockNumber > currentHeight){
        setTimeout(async () => {
            await listenBlock(blockNumber-20);
        },config.refreshingTime);
        return false;
    }

    web3.eth.getBlock(blockNumber, true).then(async (result) => {
        if (result === undefined || result === null){
            return false;
        }

        if (result.extraData === '0x') {
            result.extraData = '0x0'
        }

        let reward = blockReward.getConstReward(result.number)
        let minerReward = reward * (1 - PERCENT_OF_FOUNDATION);
        let foundation = reward * PERCENT_OF_FOUNDATION;
        let txnFees = blockReward.getGasInBlock(result.transactions);
        let unclesCount = result.uncles.length;
        let uncleInclusionRewards = blockReward.getRewardForUncle(result.number, unclesCount);


        db.query(`replace into t_blocks set number=${result.number},difficulty=${result.difficulty},
            extraData=${result.extraData},gasLimit=${result.gasLimit},gasUsed=${result.gasUsed},
            hash=${result.hash},logsBloom=${result.logsBloom},miner=${result.miner},mixHash=${result.mixHash},
            nonce=${result.nonce},parentHash=${result.parentHash},receiptsRoot=${result.receiptsRoot},
            sha3Uncles=${result.sha3Uncles},unclesCount=${unclesCount},uncleInclusionRewards=${uncleInclusionRewards},
            minerReward=${minerReward},foundation=${foundation},txnFees=${txnFees},size=${result.size},stateRoot=${result.stateRoot},
            timestamp=${result.timestamp},totalDifficulty=${result.totalDifficulty},transactionsRoot=${result.transactionsRoot}
        `,{
            replacements: [],
            type: Sequelize.QueryTypes.INSERT
        }).catch(e => {
            console.log("save block error:",blockNumber,e)
        })


        if (result.uncles.length > 0){
            web3.eth.getBlockUncleCount(blockNumber).then(count =>{

                for (var i = 0 ; i < count; i++){
                    web3.eth.getUncle(blockNumber,i).then(uncle => {

                        if (uncle.extraData === '0x') {
                            uncle.extraData = '0x0'
                        }

                        let uncleReward = blockReward.getUncleReward(uncle.number, blockNumber, reward);

                        db.query(`replace into t_uncles set blockNumber=${blockNumber},number=${uncle.number},difficulty=${uncle.difficulty},
                            extraData=${uncle.extraData},gasLimit=${uncle.gasLimit},gasUsed=${uncle.gasUsed},
                            hash=${uncle.hash},logsBloom=${uncle.logsBloom},miner=${uncle.miner},mixHash=${uncle.mixHash},
                            nonce=${uncle.nonce},parentHash=${uncle.parentHash},receiptsRoot=${uncle.receiptsRoot},
                            sha3Uncles=${uncle.sha3Uncles},size=${uncle.size},stateRoot=${uncle.stateRoot},
                            timestamp=${uncle.timestamp},transactionsRoot=${uncle.transactionsRoot},
                            uncleIndex=${i},reward=${uncleReward}
                        `,{
                            replacements: [],
                            type: Sequelize.QueryTypes.INSERT
                        }).catch(e => {
                            console.log("save uncle error:",e)
                        })
                    })
                }

            }).catch(e => {
                console.log('getBlockUncleCount error:', blockNumber)
            })
        }
        await listenBlock(blockNumber+1);

    }).catch(e => {
        console.log('getBlock error:',blockNumber,e)
    })
}

listenBlock(1992838);

