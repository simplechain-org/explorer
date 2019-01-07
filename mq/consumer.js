var amqp = require('amqplib');

var open = amqp.connect('amqp://localhost');


let receivedMessage = async function(q,callBack){
  open.then(function(conn){
    return conn.createChannel();
  }).then(function(ch){
    return ch.assertQueue(q, {durable: false}).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          callBack(msg.content.toString());
          ch.ack(msg);
        }
      });
    });  
  }).catch(console.warn);
}

// receivedMessage("Transaction",function(m){
//   console.log("received a message : ", m);
// })

