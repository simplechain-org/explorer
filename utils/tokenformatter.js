var BigNumber = require('bignumber.js');
var web3 = require('../lib/web3');

function formatter() {
    this.format = function(value,decimal) {

        if (decimal == 18){
            return web3.utils.fromWei(value, "ether");
        }

       return BigNumber(value).div(10 ** decimal).toString();
    }
}
  
module.exports = formatter;