var web3 = require('../lib/web3');
const config = new(require('../config.js'))();

function formatter() {
  this.format = function(gasPrice) {
    var w = web3.utils.fromWei(String(gasPrice), "ether");
    return Number.parseFloat(w).toFixed(10) + " "+config.baseToken;
  }
}

module.exports = formatter;