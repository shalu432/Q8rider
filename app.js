const express = require('express')
const mongoose = require('mongoose')
var bodyParser= require('body-parser')
mongoose.connect("mongodb+srv://shalu:Shalu123@cluster0.mnb96.mongodb.net/marvelapp?retryWrites=true&w=majority",{})
.then(()=>console.log("connected"))
.catch((err)=>console.log(err))
//console.log("hello")
require('dotenv').config();
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

const userRouter = require('./routes/user')
app.use('/',userRouter)

const carRouter = require('./routes/car')
app.use('/',carRouter)



const port = process.env.PORT ||5500
app.listen(port, () => {
    console.log('Server started')
})
