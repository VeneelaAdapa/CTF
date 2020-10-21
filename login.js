

let OrderModel = require("./order_schema.js")
const BodyParser = require("body-parser"); 

var cookieParser = require('cookie-parser');

var moment = require('moment');



//Mongoose.connect('mongodb://localhost/Order_5',{ useNewUrlParser: true,useUnifiedTopology: true });



module.exports = function(app){
    
    app.use(BodyParser.urlencoded({ extend: true }));
    app.use(BodyParser.json());
    app.use(cookieParser('null_chapter_is_the_best'));

    app.post("/api/login", async (request, response) => {
    try{
        
       
           var already = await OrderModel.find({ order_no: request.body.order }).exec();
            if(!already) {
                
            
         return response.status(401).json({ error: 'authentication failed due to invalid credentials'});
            }else{
                response.cookie('state', 'loggedIn',{ maxAge: 900000,signed: true, httpOnly: true });
                response.status(200).json({state: 'loggedIn',"start_time":moment().unix() });
    
            }
      }catch (error) {
            response.status(501).json({error:'internal server error'});
        }
        
            
        });

}