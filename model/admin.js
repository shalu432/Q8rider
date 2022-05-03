const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema({

    UserName : {
        type:String,
        match:[/^[A-Za-z]+$/,'Please fill a valid firstName'],
        trim:true,
        required:true

    },
    
    email:
    {
        type: String,
       unique:true,
      //  lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
        required:true
        
    },
    password:{
        type : String,
       // unique:true,
        required: true
    },
  
     isActive:{
         type:Boolean,
         default:true,
         required:true
     }


});

module.exports = mongoose.model('Admin',AdminSchema)