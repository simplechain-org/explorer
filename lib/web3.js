const config = new(require('../config.js'))();
const Web3 = require('@sipc/web3');
//const web3 = new Web3(new Web3.providers.WebsocketProvider(config.geth));
const web3 = new Web3(new Web3.providers.HttpProvider(config.gethServer));

setInterval(
    () => {
        web3.eth.net.isListening().then().catch(() => {
            console.log('[ - ] Lost connection to the node, reconnecting');
            web3.setProvider(new Web3.providers.HttpProvider(config.gethServer));
        })
    },
    config.reconnect);

module.exports = web3;
