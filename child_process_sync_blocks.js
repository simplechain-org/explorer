const { fork } = require('child_process');
const child_process_sync_blocks = () => {
  const syncBlock = fork('./services/syncBlock.js');
  syncBlock.send('start');
  syncBlock.on('message', bool => {
    if (!bool) {
      console.log("child_process-------going-----", new Date())
      child_process_sync_blocks()
    }
  });
}
module.exports = child_process_sync_blocks
