const mongoose = require('mongoose')
const Category = require('../model/category')
const BrandSchema = new mongoose.Schema({
    


    countryId:{
        
        type:mongoose.Schema.Types.ObjectId,
        ref:"Country",
    },
       
        brandName :{
         type:String,
        required:true
         
         
        }
    
})
module.exports = mongoose.model('Brand',BrandSchema)
