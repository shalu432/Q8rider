const express = require('express')
const router = express.Router()
const Admin = require('../model/admin')
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const addAdmin = async(req,res)=>
{

Admin.findOne({email:req.body.email}).then((data)=>{


if(!data)
bcrypt.hash(req.body.password,10,(err,hash)=>
{
    if(err)
    {
        return res.status(500).json({
            error:err
        })
    }
        else
        {
            const data = new Admin({
               userName: req.body.userName,
           
                email:req.body.email,
                password :hash,
              
                })
                data.save()
                .then(result=>{
                    res.status(200).json({
                        status:true,
                        code:"200",
                        new_data :result

                    })
                 })
                 .catch(err=>{
                     res.status(500).json({
                         status:"false",
                         response:"null",
                         error:err.message
                     })
                 })
                
        }
     
        })
        else{
            res.json("email  already exist")
        }
    })
    }


    const loginAdmin = (req,res)=>
    {
        Admin.find({email:req.body.email})
        .exec()
        .then(data=>
            {
                if(data.length<1)
                {
                    return res.status(401).json({
                        message: "admin not found"
                    })
                }
                else{
                    var privateKey= "shrakdfglessocttufddijeidscmsdicidskci"
                    bcrypt.compare(req.body.password,data[0].password,(err,result)=>{
                        if(!result){
                            res.status(401).json({
                                message:"password matching fail"
                            })
                        }
                        if(result)
                        {
                            const token =jwt.sign({
                              //  name:data[0].name,
                                email:data[0].email,

                            },
                            privateKey,
                            {
                                expiresIn:"48h"
                            }
                            );
                            res.status(200).json({
                               // name:data[0].name,
                                email:data[0].email,
                                token:token

                            })
                        }
                    })
                }
            })
            .catch(err=>
                {
                    res.status(500).json({
                        status:"false",
                        response:"null",
                        err:err.message
                    })

                })
    }


    module.exports = {
       
        addAdmin,
        loginAdmin,
       
    }
       