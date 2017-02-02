var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/monthly_spend';
var dbUrlMongoLab = 'mongodb://swapp1990:sS56291149@ds041546.mlab.com:41546/my-tasks';

mongoose.connect(dbUrlMongoLab);

mongoose.connection.on('connected',function() {
 console.log('Mongoose connected to ' + dbUrlMongoLab);
});
mongoose.connection.on('disconnected',function() {
 console.log('Mongoose disconnected');
});
mongoose.connection.on('error',function() {
 console.log('Mongoose connection error: ' + err);
});

process.on('SIGINT', function() {
    mongoose.connection.close( function() {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

//Bring in schemas and models
require('../routes/transaction-single.model.js');

