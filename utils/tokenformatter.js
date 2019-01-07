var BigNumber = require('bignumber.js');

function formatter() {
    this.format = function(value,decimal) {
       return BigNumber(value).div(10 ** decimal).toString();
    }
}
  
module.exports = formatter;