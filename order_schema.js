const mongoose = require('./mongoose.js');
var conn2 = mongoose.createConnection('mongodb+srv://admin:password@123@cluster0-ug10m.mongodb.net/order?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true });


const OrderSchema = new mongoose.Schema({
    
});
const OrderModel = conn2.model("order_id", OrderSchema);
module.exports= OrderModel; 