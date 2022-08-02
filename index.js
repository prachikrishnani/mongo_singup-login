const express=require('express');
const app=express()
const dotenv=require('dotenv')
const router=require('./routes/route')
const mongoose=require('mongoose')

dotenv.config();
app.use(express.json())
app.use('/user',router)

port=process.env.PORT


mongoose.connect(process.env.CONN_STR,{useNewUrlParser:true},()=>{
    console.log('connected to db');
})



app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
