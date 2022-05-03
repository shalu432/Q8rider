const mongoose = require('mongoose')
const NewsFeedSchema = new mongoose.Schema({
     
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
            
    },
   
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        hyperlink:{
            type:String,
            required:true
        }

        
})
module.exports = mongoose.model('NewsFeed',NewsFeedSchema)
