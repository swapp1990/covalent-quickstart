var express = require('express');
var router = express.Router();

var ctrlMonths = require('../controllers/months.controller.js');

router.route('/months')
  .get(ctrlMonths.monthGetAll);

router.route('/months/price')
  .get(ctrlMonths.getTotalCost);

router.route('/months/totalexpense')
  .get(ctrlMonths.getTotalExpense);

router.route('/months/totalincome')
  .get(ctrlMonths.getTotalIncome);

router.route('/search')
  .get(ctrlMonths.getDataBasedOnQuery);

router.route('/search/details')
  .get(ctrlMonths.getDataByDetails);

module.exports = router;
