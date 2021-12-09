var express = require('express')
var app = express();
var router = express.Router()
const bcrypt = require('bcryptjs');
var User = require('../Model/schema')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation');
const dotenv = require('dotenv')
const { findOne } = require('../Model/schema');
const mailgun = require("mailgun-js");


// dotenv.config();

router.post('/create',async (req,res)=>{
    
    //validation 
    const {error} = registerValidation(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    //nameExist
    const nameExist = await User.findOne({name:req.body.name})
    if(nameExist) return res.status(404).send("this name already exist use different one") 

    //emailExist
    const emailExist =await User.findOne({email:req.body.email})
    if(emailExist){
        return res.status(404).send("Email already exist") 
    }else{

    }

    // hash password 
    // var pass = req.body.password
    // const salt = bcrypt.genSalt(10)
    // const hashpassword = bcrypt.hash(pass, salt)

    //creating new user
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    try {
        await user.save()
        res.send({user:user._id})
    } catch (error) {
        res.status(400).send("Error in data collection")
    }
})

router.post('/login', async(req,res)=>{

    const {error} = loginValidation(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(404).send('Email not found')
    }else{
        const token = jwt.sign({id:user.id}, 'secretkey', {expiresIn: '20m'})
        //MailGun
        const DOMAIN = "sandbox0ef182b49e9a4ab29d50ca31b499e6f4.mailgun.org";
        const mg = mailgun({apiKey: "05c2b22e2b3d0da1ca2e834282c7b611-7005f37e-a13c9eb5", domain: DOMAIN});
        const data = {
            from: "Mailgun Sandbox <postmaster@sandbox0ef182b49e9a4ab29d50ca31b499e6f4.mailgun.org>",
            to: "akshaykore000@gmail.com", //Here we can take any email (req.body)
            subject: "Hello",
            html: `<h2>Hey here is Your Token Copy this </h2>
                    <p>${token}</p>`
        };
        mg.messages().send(data, function (error, body) {
            if(error){
                res.json("Error")
            }else{
                res.render("tokens")
            }
            
        });
    } 
    // const validPass = await bcrypt.compare(req.body.password, user.password)
    // if(!validPass) return res.status(404).send('Invalid Password')

})

router.post('/verifyToken', (req, res)=>{
    const token = req.body.token
     jwt.verify(token, 'secretkey',function(err, decodeToken){
        if(err){
            res.status(404).send("Expired token")
        }else
            res.send("Log In succesfully!!")
        })
})

module.exports=router;
