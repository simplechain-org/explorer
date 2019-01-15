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
    let length = transactions.length
    if (length === 0) {
        return 0
    } 
    let txsFee = 0;
    for (let i = 0; i < length; i++) {
        fee = (transactions[i].gas) * (transactions[i].gasPrice);
        fee = isNaN(fee)? 0 : fee
        fee = web3.utils.fromWei(String(fee));
        txsFee += parseFloat(fee);
    }
    return txsFee
}

module.exports = {
    getUncleReward,
    getGasInBlock,
    getConstReward,
    getRewardForUncle
}
