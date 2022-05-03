const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let ItemSchema = new Schema(
  {
    
    postId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Car"
      
  },
    product:{
    type:String
    },
    model:{
      type:String
    },
    price:{
      type:String,
      required:true
  },
  categoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
    
 },
  dealershipId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Country"
},
  
  }
    );





const favouriteListSchema = new Schema({
     
   userId:{
    type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    
    items: [ItemSchema],



   
        
        
})
module.exports = mongoose.model('favouriteList',favouriteListSchema)
