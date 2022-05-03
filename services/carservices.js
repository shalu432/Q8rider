const Car=require('../model/carschema')
const User = require('../model/userschema')
const Category=require('../model/category')
const { ObjectId } = require("bson")
const favouriteList=require('../model/favourite')



const insertdata = async(model,data,res)=>{
    try{
        res=await model.insertMany(data)
       // console.log(res);
        if(res.length>0){
            return res
        }
    }
    catch(error)
    {
        return error
    }
}

const getPost = async(data,res)=>{
    try{
        res=await Car.find({_id:ObjectId(data)})
       console.log(res);
        if(res.length>0){
          return res
            
        }
        else{
            return 0
        }
    }
    catch(error)
    {
        return error
    }
}

const viewPost=async(model,data,res)=>{
try{
    
    res = await model.aggregate(data)
    //console.log(res);
    if(res.length>0){
        return res
          
      }
      else{
          return 0
      }


}catch(error){
    return error
}
}



const getfav = async(data,res)=>{
    try{
        res=await favouriteList.find(ObjectId(data))
        if(res.length>0){
          return res
            
        }
    }
    catch(error)
    {
        return error
    }
}


const updateQuery = async(id,data,res)=>{
    try{
        res= await Car.findOneAndUpdate(id,{$set:data},{new:true})
        console.log(res);
        if(res==null)
        {
            return 0
        }
        else{
            return res
        }
    }
    catch(error){
        return error
    }
}



const update = async(id,data,res)=>{
    try{
        
        res= await favouriteList.findOneAndUpdate(id,{$pull:data},{new:true})

        if(res==null)
        {
            return 0
        }
        else{
            return res
        }
    }
    catch(error){
        return error
    }
}

const findUser= async(model,data)=>{
    try{
        res=await model.findOne({_id:data})
      // console.log(res);
        if(res!=null){
            return res
              
          }}
          catch(error){
              return error
          }
}



const getreportedPost = async(model,data,res)=>{

    try{
        res=await model.findOne({data})
      // console.log(res);
        if(res!=null){
            return res
              
          }else{
              return 0
          }
        }
          catch(error){
              return error
          }


}
const find=async(model,data,res)=>{

 res= await model.findOne(data)
 {
    if(res!=null){
        return res
          
      }
      else{
          return 0
      }
 }


}



module.exports = {
   
    insertdata,
    getPost,
    viewPost,
    getfav,
    update,
    updateQuery,
    findUser,
    getreportedPost,
    find
   
}