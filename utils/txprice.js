var web3 = require('../lib/web3');
var BigNumber = require('bignumber.js');
const config = new(require('../config.js'))();
var BN = web3.utils.BN;

function formatter() {
  this.format = function(gas,gasPrice) {
    var price = new BigNumber(gas * gasPrice).toString();
    var bn = new BN(price).toString();
    var w = web3.utils.fromWei(bn, "ether") + " " + config.baseToken;
    return w;
  }
}

module.exports = formatter;