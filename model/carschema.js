const mongoose = require('mongoose')
const User = require('../model/userschema')
const CarSchema = new mongoose.Schema({
    
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"

    },
    
    product:{
         type:String,
         required:true
     },
     model:{
        type:String,
        required:true
    },
     categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
        
     },
     price:{
         type:String,
         required:true
     },
     mileage:{
         type:Number,
         required:true
     },
     enginePower:{
         type:Number,
         required:true
     },
     manufacturedYear:{
        type: Date,
        min:Date[1960-01-01],
        max:Date.now,
        required: true
     },
     transmissionType:[{
         type:String,
         enum:["Automatic","manual","triptronic"],
         required:true
     }],
     conditions:{
         type:String,
         enum:["poor","acceptable","good","excellent"],
         required:true
     },
     fuelType:[{
         type:String,
         enum:["petrol","disel","electric","hybrid"],
         required:true
     }],
     cyclinders:{
         type:String,
         enum:["4","6","8","10","12","16"],
         required:true
     },
     dealershipId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Country"
     },
       report:{
           type:Number,
           default:0
       },
       postType:{
           type:String
       } 
     }
)
module.exports = mongoose.model('Car',CarSchema)
