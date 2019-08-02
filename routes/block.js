const express = require('express');
const router = express.Router();
const web3 = require('../lib/web3');
const db = require('../lib/db')
const Sequelize = require("sequelize");


router.get('/:block', async (req, res, next) => {

  let param = req.params.block;

  let blocks = await db.query(`
            select * from blocks where number=? or cast(hash as CHAR)=?
        `, {
    replacements: [param,param],
    type: Sequelize.QueryTypes.SELECT
  })

  let block = blocks[0];

  let transactions = await db.query(`
            select * from transactions where blockNumber=?
        `, {
    replacements: [block.number],
    type: Sequelize.QueryTypes.SELECT
  })


  let uncles = await db.query(`
            select * from uncles where blockNumber=?
        `, {
    replacements: [block.number],
    type: Sequelize.QueryTypes.SELECT
  })


  let blockReward = 0;

  uncles.forEach(function(uncle){
    blockReward += uncle.reward;
  })

  block.uncles = uncles;
  block.uncleReward = blockReward;
  block.transactions = transactions;

  const blockNumber = await web3.eth.getBlockNumber();
  res.render('block', {
    block,
    blockNumber
  });

});

module.exports = router;
