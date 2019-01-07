
function hashFormatter() {
  this.format = function(txt) {

     if (txt === null || txt === undefined) return '';

      var hash = String(txt);
      if (hash && hash.length > 10){
        return hash.substr(0, 10) + "...";
      } else {
        return hash;
      }
  }
}
module.exports = hashFormatter;