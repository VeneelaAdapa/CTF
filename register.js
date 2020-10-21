


var cookieParser = require('cookie-parser');
const BodyParser = require("body-parser"); 

let UserModel = require('./user_schema.js');

module.exports = function(app){

app.use(cookieParser('null_chapter_is_the_best'));


app.use(BodyParser.urlencoded({ extend: true }));
app.use(BodyParser.json());
app.post("/api/register", async (request, response) => {
    try {
        if(request.signedCookies['state']==='loggedIn'){
        var user = new UserModel(request.body);
        var user_check = await UserModel.findOne({ email: request.body.email }).exec();
        var nick_name_check = await UserModel.findOne({ nickname: request.body.nickname }).exec();
        if(!nick_name_check && !user_check) {
            var result = await user.save();
            response.cookie('state', 'registered',{ maxAge: 900000,signed: true, httpOnly: true });
            response.cookie('username', request.body.email,{ maxAge: 900000,signed: true, httpOnly: true });
            return response.status(200).json({state: "registered"});
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
}