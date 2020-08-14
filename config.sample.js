
var config = function () {

  this.logFormat = "combined";
  this.gethServer = "http://127.0.0.1:8545";
  this.reconnect = 1000;

  this.mysql = {
    database : 'explorer',
    user : 'root',
    password : 'admin123',
    host : 'localhost'
  };

  this.baseToken = 'SIPC';
  this.refreshingTime = 5000;

  this.mq = {
    enable:false,
    server:'amqp://localhost',
    key:'Transaction'
  }
}

module.exports = config;
