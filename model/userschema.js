const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({

    

    userName: {
        type: String,
        
    },

    password:{
        type : String,
        required : true,
   },
   
  
    Gender: {
        type: String,
        enum:["male","female","others"],
      required:true
    },
   

    phoneNumber:
    {

        type:String,
        unique:true,
      
   }, 
      

   
    email:
    {
        type: String,
        unique: true,
        lowercase: true,
      

    },

    countryCode:

    {
        type: String,
        match: [/^(\+?\d{1,3}|\d{1,4})$/gm],
       required: true
    },
        socialId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Social"
    },
    
    isActive:{
        type:Boolean,
        default:true
     },

     termsandconditions:{
         type:Boolean,
       default:true
     },
     privacyPolicy:{
         type:Boolean,
        default:true
     }




   
})
   
module.exports = mongoose.model('User', UserSchema)
