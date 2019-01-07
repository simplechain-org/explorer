var BigNumber = require('bignumber.js');

function formatter() {
    this.format = function(txt) {
        if (isNaN(txt)) return txt;
        var b = new BigNumber(txt);
        return b.toFormat(0);
    }
}

module.exports = formatter;
