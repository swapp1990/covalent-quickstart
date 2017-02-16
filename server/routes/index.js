var express = require('express');
var router = express.Router();

var ctrlMonths = require('../controllers/months.controller.js');

router.route('/months')
  .get(ctrlMonths.monthGetAll);

router.route('/months/price')
  .get(ctrlMonths.getTotalCost);

router.route('/search')
  .get(ctrlMonths.getDataBasedOnQuery);

router.route('/search/details')
  .get(ctrlMonths.getDataByDetails);

module.exports = router;
