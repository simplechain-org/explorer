function formatter() {
    this.format = function(size) {
        if (isNaN(size)) return size;
        var s = size / 1000;
        return s.toFixed(3) + " KB";
    }
}
  
module.exports = formatter;