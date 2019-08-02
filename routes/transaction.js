var express = require('express');
var router = express.Router();
var web3 = require('../lib/web3');
const db = require('../lib/db')
const Sequelize = require("sequelize");

router.get('/:hash', async function(req, res, next) {

  let blockNumber = await web3.eth.getBlockNumber();

  let transactions = await db.query(`
            select * from transactions where cast(hash as CHAR)=?
        `, {
    replacements: [req.params.hash],
    type: Sequelize.QueryTypes.SELECT
  })

  let transaction = transactions[0];

  let blocks = await db.query(`
            select * from blocks where number=? 
        `, {
    replacements: [transaction.blockNumber],
    type: Sequelize.QueryTypes.SELECT
  })

  transaction.block = blocks[0];

  res.render('transaction', { transaction:transaction ,blockNumber:blockNumber});
});

module.exports = router;
