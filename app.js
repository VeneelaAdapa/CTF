const Express = require("express");


var app = Express();
require('./login')(app);
require('./register')(app);
require('./logout')(app);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Listening at :3000...");
});

app.get("/",async(request,response)=>{
return reponse.sendFile(__dirname+"welcome.html");
})
