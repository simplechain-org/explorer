var express = require('express');
var router = express.Router();
var { Uncle } = require("../services/orm");

router.get('/:uncle', function (req, res, next) {

  var paramter;
  if (req.params.uncle.startsWith('0x')) {
    paramter = { hash: req.params.uncle };
  } else {
    paramter = { height: req.params.uncle };
  }

  return Uncle.findOne({
    where: paramter
  }).then(async (block) => {
    res.render('uncle', {
      block
    });
  });
});

module.exports = router;
