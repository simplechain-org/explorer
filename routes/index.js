var express = require('express');
var router = express.Router();
var {Block, Transaction} =  require("../services/orm");

/* GET home page. */
router.get('/', async function(req, res, next) {
  let blockParams = {
    order : [
      ['height','DESC']
    ],
		offset:0,
		limit:15
  };
  

  let txParams = {
    order : [
      ['blockNumber','DESC']
    ],
		offset:0,
		limit:15
  };

  var blocks = await Block.findAll(blockParams);
  var transactions = await Transaction.findAll(txParams);

  res.render('index', { blocks: blocks,transactions:transactions });
});

module.exports = router;
