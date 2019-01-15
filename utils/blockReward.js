let Config = new (require('../config.js'))();
let web3 = require('../lib/web3');

// 获取普通区块奖励。 从0开始，每250万个区块后减半。
function getConstReward(height) {
    const year = 2500000
    let n = Math.ceil((height + 1) / year)
    return 20 * Math.pow((1 / 2), n - 1)
}

// 包含叔块的奖励,最多两个叔块
function getRewardForUncle(height, uncleNumber) {
    let reward = getConstReward(height);
    return (reward / 32) * uncleNumber;
}

// 获取叔块奖励,uHeight为叔块高度，height为包含区块高度
function getUncleReward(uHeight, height) {
    let reward = getConstReward(height);
    reward = (uHeight + 8 - height) * reward / 8;
    return reward
}

// 获取区块所有消耗的txsFee
function getGasInBlock(transactions) {
    let txsFee = 0;
    let length = transactions.length
    for (let i = 0; i < length; i++) {
        fee = (transactions[i].gasUsed) * (transactions[i].gasPrice);
        fee = web3.utils.fromWei(fee.toString());
        txsFee += parseFloat(fee);
    }
    return txsFee
}

//获取区块奖励
function getBlockReward(block) {
    const { height, uncleCount, transactions } = block
    const constReward = parseFloat(getConstReward(height));
    let uReward = 0
    if (uncleCount > 0) {
        uReward += getRewardForUncle(height, uncleCount);
    }
    TxsFee = getGasInBlock(transactions)
    let total = constReward + TxsFee + uReward
    return `${total} ${Config.baseToken} (${constReward * 0.95}+${constReward * 0.05}+${TxsFee}+${uReward})`;
}

module.exports = {
    getBlockReward,
    getUncleReward
}
