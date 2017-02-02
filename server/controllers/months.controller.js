var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');

module.exports.monthGetAll = function(req, res) {
  var offset = 0;
  var count = 5;

  if(req.query && req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }
  if(req.query && req.query.count) {
    count = parseInt(req.query.count, 10);
  }

  Transaction
    .find()
    .skip(offset)
    .exec(function(err, months) {
      //console.log("Found Hotels", months.length);
      res.json(months);
    });
};
