const bcrpt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const env = require("dotenv");
env.config();

const secretToken = process.env.JWT_SECRET;
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.send("hello").status(300);
})

const verification = (req, res, next) => {
    const data = req.headers.authorization?.split(' ')[1];
    console.log(data);

    if(!data){
        res.send({message : "Unauthorized user for accessing"}).status(500);
    }

    try{
        const decode = jwt.verify(data, secretToken);
        req.user = decode;
        console.log(decode);
        next();
    }catch(err){
        console.error("JWT Error:", err.message);
        if (err.name === "JsonWebTokenError") {
            return res.status(401).send("Invalid token (tampered/wrong secret).");
        } else if (err.name === "TokenExpiredError") {
            return res.status(401).send("Token expired.");
        }
        res.status(500).send("Authentication failed.");
    }
}

app.get('/settings', verification, (req, res) => {
    res.send("This is important data").status(200);      //credentials
})

app.post('/signup', (req, res) => {
    const saltRound = 10; //saltRounds = 10 means the hashing algorithm will be applied 2^10 times (1024 rounds). -> its computation cost
    const {name, email, password} = req.body;
    console.log(`name is ${name} email is ${email} password is ${password}`);

    try{
        bcrpt.genSalt(saltRound, function(err, salt){
            bcrpt.hash(password, salt, function(err, hash){
                console.log(`password is created ${hash}`);         //TODO1 -> store in the DB
            })
        })


        res.send({message: "Password created successfully"}).status(200);
    }
    catch(err){
        console.log(`Error is found ${err}`);
        res.send({message: "Error is found ", err}).status(404);
    }
})

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    console.log(`email is ${email} password is ${password}`);
    try{
        bcrpt.compare(password, "$2b$10$F5BcY1v20n.Q2SbzQaHPNem2BB0O3JQzJQnj1nlLu4KTGx.I3v25e", function(err, result){      // TODO2 Fetch from DB and then compare
            if(!result){
                res.send({message: "Password is incorrect ", err}).status(404);
            }else{
                console.log("Password Verified successfully");
            }
        })
        const token = jwt.sign(email,secretToken);
        console.log(token);
        res.send({message: `Token created successfully ${token}`}).status(200);     //imagine that browser store that token inside the localstorage
    }
    catch(err){
        console.log(`Error is found ${err}`);
        res.send({message: "Error is found ", err}).status(404);
    }
})

app.listen(port);