var express = require('express');
var router = express.Router();
var { Uncle } = require("../services/orm");
var blockReward = require('../utils/blockReward');
router.get('/:uncle', function (req, res, next) {

  var paramter;
  if (req.params.uncle.startsWith('0x')) {
    paramter = { hash: req.params.uncle };
  } else {
    paramter = { height: req.params.uncle };
  }

  return Uncle.findOne({
    where: paramter
  }).then(async (data) => {
    let reward = blockReward.getUncleReward(data.number, data.blockNumber)
    res.render('uncle', {
      block: data,
      reward
    });
  });
});

module.exports = router;
