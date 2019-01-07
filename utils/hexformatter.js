
function formatter() {
    this.format = function(hexx) {
        
        var hex = hexx.toString(); //force conversion
        if (hex == null || hex == undefined) return '';

        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));

        return str;
    }
  }
  module.exports = formatter;