var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/douban');
mongoose.Promise = global.Promise;  
var db = mongoose.connection;
var Schema = mongoose.Schema;
var User = new Schema({
  name: String,
  password: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
exports.user = db.model('users', User); //  与users集合关联