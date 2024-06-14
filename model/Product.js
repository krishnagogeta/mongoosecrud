const mongoose=require('mongoose')
const productSchema= new mongoose.Schema({
    
    p_name:String,
    p_cost:Number,
    p_des:String,
    p_img:String,
    p_id:Number,
})
module.exports=mongoose.model("Product",productSchema)