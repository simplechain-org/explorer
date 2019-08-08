const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const db = require('../lib/db');

router.get('/', function (req, res, next) {

    db.query("select * from chart order by date asc", {
        replacements: [],
        type: Sequelize.QueryTypes.SELECT
    }).then((result) => {
        res.render('chart', {
            data: JSON.stringify(result)
        });
    })

});

module.exports = router;
