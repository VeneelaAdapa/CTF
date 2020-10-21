var mongoose = require('mongoose');

module.exports = exports = mongoose;
/*

var conn      = mongoose.createConnection('mongodb://localhost/testA');
var conn2     = mongoose.createConnection('mongodb://localhost/testB');

// stored in 'testA' database
var ModelA    = conn.model('Model', new mongoose.Schema({
  title : { type : String, default : 'model in testA database' }
}));

// stored in 'testB' database
var ModelB    = conn2.model('Model', new mongoose.Schema({
  title : { type : String, default : 'model in testB database' }
}));
*/