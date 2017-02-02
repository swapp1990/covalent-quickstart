require('./server/data/db.js');
// server.js
const express = require('express');
var routes = require('./server/routes');
const app = express();
const path = require('path');
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

app.use('/api', routes);

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
