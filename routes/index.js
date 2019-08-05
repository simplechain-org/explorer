const express = require('express');
const router = express.Router();
const db =  require("../lib/db");
const Sequelize = require("sequelize");
/* GET home page. */
router.get('/', async function(req, res, next) {

    let blocks = await db.query(`
            select * from blocks order by number desc limit 15
        `, {
        replacements: [],
        type: Sequelize.QueryTypes.SELECT
    })

    let transactions = await db.query(`
            select * from transactions order by blockNumber desc limit 15
        `, {
        replacements: [],
        type: Sequelize.QueryTypes.SELECT
    })

    res.render('index', { blocks: blocks,transactions:transactions });
});

module.exports = router;
