var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
  name : {
    type : String
  },
  date : {
    type : Number,
    min : 1,
    max : 31,
    default : 1
  },
  price : Number,
  category : String,
  payment : String,
  type : String,
  month: String,
  year: Number,
  isIncome: String,
  isEssential: String,
  details: mongoose.Schema.Types.Mixed
});

mongoose.model('Transaction', transactionSchema, 'monthlySpent');
