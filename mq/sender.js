const amqp = require('amqplib');
const config = new(require('../config.js'))();

let sendMessage = async function(q,m){
    if (config.mq.enable){

        const open = amqp.connect(config.mq.server);

        open.then(function(conn){
            return conn.createChannel();
        }).then(function(ch){
            return ch.assertQueue(q, {durable: false}).then(function(ok) {
                return ch.sendToQueue(q, new Buffer(m));
            });
        }).catch(console.warn);
    }
}

// sendMessage("hello","789");
// sendMessage("hello","456");

module.exports = {
    sendMessage
};