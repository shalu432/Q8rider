const mongoose = require('mongoose')
const socialLoginSchema = new mongoose.Schema({
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
     },
    
            loginType :{
            type:String,
            enum:["facebook","google","emailorphoneno"],
            required:true
            
        },
        socialId:{
            type:String,
            required:true
        }
        
})
module.exports = mongoose.model('Social',socialLoginSchema)
