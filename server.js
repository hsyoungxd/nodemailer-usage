const express = require("express");
const nodemailer = require("nodemailer");
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");

const PORT = 4000;

app.get('/send-email', (req, res)=>{
    res.render("index");
});

app.post('/send-email', async (req, res)=>{
    let {email, subject, text} = req.body;
    try{
        let errors = [];
        if(!email || !subject || !text){
            errors.push({message: "Please enter all fields"})
        }
        if(errors.length != 0){
            console.log(errors)
            res.render("index", {errors});
        } else {
            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            try{
                let info = await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: subject,
                    text: text
                });
                console.log('Message sent: %s', info.messageId);
                res.send('Email send successfully');
            }catch(error){
                console.log(error);
                res.send('Failed to send email');
            }
        }
    }catch(error){
        console.log(error);
    }
});

app.listen(PORT, ()=>{
    console.log("Server runs at port " + PORT);
});