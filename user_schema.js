
const mongoose = require('./mongoose.js');
var conn = mongoose.createConnection('mongodb+srv://admin:password@123@cluster0-ug10m.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    nickname: String,
    
    email:String,
    
    loggedin:{ 
        type : Boolean, 
        default: false 
    },
    registered:{ 
        type : Boolean, 
        default: false 
    },
    score:{
        type:Number,
        default:0
    },
    rank:{
        type:Number,
        default:0
    }
});


//
/*var ModelA    = conn.model('Model', new mongoose.Schema({
    title : { type : String, default : 'model in testA database' }
  }));
  */

const UserModel = conn.model("user", UserSchema);


module.exports = UserModel;