const express = require('express')
const router = express.Router()
var bodyParser = require("body-parser")
var urlencoderParser =  bodyParser.urlencoded({extended:false})
const jwt = require('jsonwebtoken')
var privateKey= "shrakdfglessocttufddijeidscmsdicidskci"
var adminJWT = (req,res,next)=>{

    var token =req.headers.authorization;
    jwt.verify(token,privateKey,function(err,decoded){
        if(err)
        {
            res.send({message:"invalid token"})
        }
        else{
             req.admin=decoded.id
            next();
        }
    }) 
    
}
module.exports= {
    adminJWT
}