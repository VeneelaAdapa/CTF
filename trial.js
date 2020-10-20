const Express = require("express");
const BodyParser = require("body-parser");
const Mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const path = require('path');
var moment = require('moment');


var cookieParser = require('cookie-parser');

var app = Express();

app.use(cookieParser('null_chapter_is_the_best'));


app.use(BodyParser.urlencoded({ extend: true }));
app.use(BodyParser.json());
//mongodb+srv://admin:password@123@cluster0-ug10m.mongodb.net/test?retryWrites=true&w=majority
Mongoose.connect("mongodb+srv://admin:password@123@cluster0-ug10m.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true });
//Mongoose.connect("mongodb://127.0.0.1:27017/Orders",{ useNewUrlParser: true,useUnifiedTopology: true });

const OrderSchema = Mongoose.Schema({
    orderId: String
});

const UserSchema = new Mongoose.Schema({
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


const OrderModel = new Mongoose.model("order_id", OrderSchema);

const UserModel = new Mongoose.model("user", UserSchema);
app.get('/', function(request, response) {
    return response.sendFile(__dirname + '/welcome.html');
});

app.post("/login", async (request, response) => {
    
    try {
       
        var user = new OrderModel(request.body);
        var already = await OrderModel.findOne({ order_id: request.body.order_id }).exec();
        if(!already) {
            // var result = await user.save();
        
     return response.status(401).json({ error: 'authentication failed due to invalid credentials'});
        }else{
             
            response.status(200).json({ message: ' User authenticated',"start_time":moment().unix() });

        }
      }catch (error) {
        response.status(501).json({error:'internal server error'});
    }
      
        
    }); 


app.post("/register", async (request, response) => {
    try {
        if(request.signedCookies['login']===true){
        var user = new UserModel(request.body);
        var user_check = await UserModel.findOne({ email: request.body.email }).exec();
        var nick_name_check = await UserModel.findOne({ nickname: request.body.nickname }).exec();
        if(!nick_name_check && !user_check) {
            var result = await user.save();
            response.cookie('username', request.body.email,{ maxAge: 900000,signed: true, httpOnly: true });
            return response.status(200).json({message:"User registered","start_time":moment().unix()});
        }else if(!nick_name && user_check){
             
            return response.status(400).json({error: 'Email already exists' });
        }
        else if(nick_name && !user_check){
             
            return response.status(400).json({error: 'nickname already exists' });
        }
    }else{
        return response.status(401).json({error:"Unauthorized access"});
    }

    } catch (error) {
        response.status(501).json({error:'internal server error'});
    }
});

app.post("logout",async(request,response)=>{
    
        try {
            if(request.signedCookies['login']===true){
        var user = await UserModel.findOne({ email: request.signedCookies['username'] }).exec();
        if(!user) {
            return response.status(400).json({message:"The email does not exist"});
        }
        
        else{
        UserModel.findOne({email: request.signedCookies['username']}, function(err, user){
            if(err)return ("err");
            user.loggedin = false;
            user.save(function(err){
               if(err)return ("err");
               //user has been updated
             });
                return response.json({message:"Logged out sucessfully"});
           });
        }
    }else{
        response.json({message:"User not logged in"});
    }
    
    } catch (error) {
        response.status(501).json({error:'internal server error'});
    }
});




//const challenges = require('./challenges.json');


app.post("/get-challenges", async(request,response)=>{
    try {
        var user = await UserModel.findOne({ email: request.signedCookies['username'] }).exec();
        if(!user) {
            return response.status(400).json({message:"User not registered"});
        }
        
        
        else{
        UserModel.findOne({email: request.signedCookies['username']}, function(err, user){
            if(err)return ("err");
            if(user.loggedin === true) return response.send(JSON.stringify(challenges));
            else return response.json({message:"user not logged in!!"});
           });
        }
    
    } catch (error) {
        response.status(501).json({error:'internal server error'});
    }
});
app.post("/check-response", async(request,response)=>{
    console.log(request.body.user.name);

});
app.post("/leaderboard", async(request,response)=>{
    try{
    if(request.signedCookies['login']===true){
    var rank =0;
   
    var user=Mongoose.model('user');
      user
      .find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
            
            result.forEach(function(each) {
                rank++;
                each.rank = rank;
                each.save(function(err){
                    if(err)return ("err");
                    //user has been updated
                  });
              });
              
          response.json(result);
        }
      })
    
      .limit(3).sort({ score: -1 });
    }else{
        return response.status(401).json({error:"Unauthorized access"});
    }

    } catch (error) {
        response.status(501).json({error:'internal server error'});
    }
  });



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening at :3000...");
});
