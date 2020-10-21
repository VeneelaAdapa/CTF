
var cookieParser = require('cookie-parser');
const BodyParser = require("body-parser"); 

let UserModel = require('./user_schema.js');

module.exports = function(app){

app.use(cookieParser('null_chapter_is_the_best'));


app.use(BodyParser.urlencoded({ extend: true }));
app.use(BodyParser.json());

app.post("/api/logout",async(request,response)=>{
    
    try {
        if(request.signedCookies['state']==='registered'){
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
         response.cookie('state', 'loggedOut',{ maxAge: 900000,signed: true, httpOnly: true });
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
}