const express = require('express')
const mongoose = require('mongoose');
var app = express();
var bodyparser = require('body-parser')
const hbs = require('hbs')
app.use(bodyparser.urlencoded({extended:false}))

app.set('view engine', 'hbs');
app.get('/home', (req, res)=>{
    res.sendFile(__dirname + "/html.html")
})

//mongoAtlasDB
let db = 'mongodb+srv://Akshay:Akshay1168@cluster0.i8p3c.mongodb.net/Users00?retryWrites=true&w=majority'
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology:true}, ()=>{
    console.log("Db connected succesfully");
}) 

//usinJSON
app.use(express.json())

app.listen(8000, ()=>{
    console.log("Server connected succesfully!");
})
app.use('/api/user',require('./router/auth'))
