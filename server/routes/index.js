var express = require('express');
var router = express.Router();

var ctrlMonths = require('../controllers/months.controller.js');

router.route('/months')
  .get(ctrlMonths.monthGetCategory)
  .post(ctrlMonths.monthCreateOne);

router.route('/months/:monthId')
  .put(ctrlMonths.monthUpdateOne)
  .delete(ctrlMonths.monthDeleteOne);

router.route('/months/price')
  .get(ctrlMonths.getTotalCost);

router.route('/months/totalexpense')
  .get(ctrlMonths.getTotalExpense);

router.route('/search')
  .get(ctrlMonths.getDataBasedOnQuery);

router.route('/search/details')
  .get(ctrlMonths.getDataByDetails);

module.exports = router;
