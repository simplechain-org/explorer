const express = require('express');
const router = express.Router();
const web3 = require('../lib/web3');
const db = require('../lib/db')
const Sequelize = require("sequelize");
const config = new (require('../config.js'))();

const PAGE_LIMIT = 10

router.get('/:account', async function (req, res, next) {

    let account = req.params.account;
    const { transOffset = 0, minerOffset = 0, uncleOffset = 0 } = req.query;

    let accounts = [];

    await web3.eth.getBalance(account).then(function (balance) {
      accounts.push({ address: account, tokenAddress: config.baseToken, value: balance });
    });


    let transactions = await db.query("select * from transactions where cast(`from` as CHAR) =? or cast(`to` as CHAR) =? order by blockNumber desc limit ? , ?", {
      replacements: [account,account,parseInt(transOffset), PAGE_LIMIT],
      type: Sequelize.QueryTypes.SELECT
    })

    let miningRecord = await db.query("select * from blocks where cast(miner as CHAR)=? order by number desc limit ? , ?", {
      replacements: [account,parseInt(minerOffset), PAGE_LIMIT],
      type: Sequelize.QueryTypes.SELECT
    })

    let unclesRecord = await db.query("select * from uncles where cast(miner as CHAR)=? order by blockNumber desc limit ? , ?", {
      replacements: [account,parseInt(uncleOffset), PAGE_LIMIT],
      type: Sequelize.QueryTypes.SELECT
    })


    res.render('account', {
      accounts: accounts,
      transactions: transactions,
      account: account,
      transOffset,
      miningRecord,
      unclesRecord,
      uncleOffset,
      minerOffset,
      stepSize: PAGE_LIMIT
    });
  // });

});

module.exports = router;
