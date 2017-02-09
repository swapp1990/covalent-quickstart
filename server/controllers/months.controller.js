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

module.exports.monthGetCategory = function(req, res) {
  var query = {
    month: req.query.month
  };

  if(req.query && req.query.category) {
    console.log(req.query.category);
    query.category = req.query.category;
  }
  if(req.query && req.query.year) {
    //console.log(req.query.category);
    query.year = req.query.year;
  }
  Transaction
    .find()
    .where(query)
    .exec(function(err, months) {
      //console.log("Found Rows", months.length);
      res.json(months);
    });
};

module.exports.monthCreateOne = function(req,res) {
  console.log("Create ", req.body);
  Transaction
    .create({
      name : req.body.name,
      date : req.body.date,
      price : req.body.price,
      payment : req.body.payment,
      category: req.body.category,
      month: req.body.month,
      year: req.body.year,
      isIncome: req.body.isIncome,
      isEssential: req.body.isEssential,
      details: req.body.details
    }, function(err, body) {
      if(err) {
        console.log("Error creating new data");
        res
          .status(400)
          .json(err);
      } else {
        console.log("Data Created");
        res
          .status(201)
          .json(body);
      }
    });
};

module.exports.monthDeleteOne = function(req,res) {
  var monthId = req.params.monthId;
  Transaction
    .findByIdAndRemove(monthId)
    .exec(function(err, doc) {
      if(err) {
        console.log("Error deleting month data");
        res.status(500).json(err);
      } else {
        console.log("Deleting month data successfull");
        res.status(204).json(doc);
      }
    });
};

module.exports.monthUpdateOne = function(req,res) {
  var monthId = req.params.monthId;
  Transaction
    .findById(monthId)
    //.select("-reviews -rooms") exclude nested models.
    .exec(function(err, doc) {
      var response = {
        status : 200,
        message : doc
      };
      if(err) {
        console.log("Error finding month data");
        response.status = 500;
        response.message = err;
      } else if(!doc) {
        response.status = 404;
        response.message = {
          "message": "Month Id not found"
        };
      }
      if(response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        //console.log("req " , req.body);
        if(req.body.name) {
          doc.name = req.body.name;
          doc.date = req.body.date;
          doc.price = req.body.price;
          doc.category = req.body.category;
          doc.payment = req.body.payment;
          doc.month = req.body.month;
          doc.year = req.body.year;
          doc.isIncome = req.body.isIncome;
          doc.isEssential = req.body.isEssential;
          if(req.body.details) {
            doc.details = req.body.details;
          } else {
            // var value = {"val1": 5, "val2": "hello"};
            // doc.details = value;
          }
          console.log("updated doc " , doc);
          //services = _splitArray(req.body.services),
          doc.save(function(err, monthUpdated) {
            if(err) {
              res.status(500).json(err);
            } else {
              res.status(200).json(monthUpdated);
            }
          });
        }
      }
    });
};


//Aggregation function
module.exports.getTotalCost = function(req, res) {
  var query = {};
  if(req.query) {
    if(req.query.month) {
      query.month = req.query.month;
    }
    if(req.query.category) {
      query.category = req.query.category;
    }
    if(req.query && req.query.isIncome) {
      query.isIncome = req.query.isIncome;
    }
    if(req.query.isEssential) {
      query.isEssential = req.query.isEssential;
    }
  }
  Transaction.aggregate([
    {
      $match: query
    },
    {
      $group: {
        _id: {
          "category": "$category",
          "month": "$month"
        },
        balance: { $sum: "$price"  }
      }
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    //console.log(result);
    res.json(result);
  });
}
