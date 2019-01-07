var express = require('express');
var router = express.Router();
var {Account,TokenConfig} =  require("../services/orm");

const Sequelize = require("sequelize");
const Op = Sequelize.Op

router.get('/:offset?', function(req, res, next) {
  
  if (!req.params.offset) {
    req.params.offset = 0;
  } else {
    req.params.offset = parseInt(req.params.offset);
  }

  let params = {
    include:[{
      model:TokenConfig,
      as:'config'
    }],
    where : {
      value : {
        [Op.gt]: 0
      }
    },
    order : [
      ['address','ASC']
    ],
		offset:req.params.offset,
		limit:50
  };
  
  Account.findAll(params).then((data)=>{
    // console.log("data:",data);
    res.render('accounts', { accounts: data, offset: req.params.offset, stepSize: 50 });
  });

});

module.exports = router;
