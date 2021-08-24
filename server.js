const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('./src/db/mongoose');
const bcrypt = require('bcrypt');
const { User } = require('./src/db/models/user.model');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const fs = require('fs');
const RSA_PRIVATE_KEY = fs.readFileSync('src/app/shared/private.key');
const RSA_PUBLIC_KEY = fs.readFileSync('src/app/shared/public.key');


app.use(express.json());
app.use(express.static(__dirname + 'dist/frest-app'));
app.get("*", function (req, res){
    res.sendFile(path.join("src/index.html"));
});



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next(); 
  });

app.post('/findOne', (req, res) => {
    let postedEmail = req.body.email;
    User.findOne({email: postedEmail}, function(err, result){
        
        if (err) {
            res.send("Query failed");
        }
        else if (result){
            res.send("400");
        }
        else {
            console.log("200");
        }
    });
})

app.get('/find', (req,res) => {
    User.find({}).then((userData) => {
        res.send(userData);
    });
})

app.get('/getResturants', (req,res) => {
    let userEmail = req.query.email;
    User.find( {email: userEmail }).then( (userData) =>{
        res.send(userData);
    });
})


app.post('/addResturants', (req,res) => {
    console.log("/addResturants called");
    restName = req.body.resturantName;
    restAddy = req.body.resturantAddress;
    userEmail = req.body.email;
    User.update({ email: userEmail }, { $addToSet: { favouriteResturants: {"name": restName, "address": restAddy}} }, { new: true }, (err,res) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
            
        }
    });
    res.send("success");
})

app.post('/register', (req,res) => {
    let postedEmail = req.body.email;
    let postedPW = req.body.password;
    let postedName = req.body.name;

    /* Check if the email is already registered with the system. */
    User.findOne({email: postedEmail}, function(err,emailStatus){
        if(emailStatus){
            console.log(emailStatus.email + ' already regisetered');
            res.send("400");
        }   
        else{
            /*Bcrypt logic*/
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(postedPW, salt, function(err, hash) {
                    if (err){
                        console.log("Hasing failed " + err);
                    }
                    else{
                        let newUser = new User ({
                            email: postedEmail,
                            password: hash,
                            name: postedName,
                        });
                        newUser.save().then((userData) => {
                            console.log(userData)
                        })
                        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: 120,
                            
                        });
                        res.status(200).json({
                            idToken: jwtBearerToken, 
                            expiresIn: 120,
                            name: postedName
                          });
                    }
                });
            });
        }
    })
})

app.post('/login', (req,res) => {
    let postedEmail = req.body.email;
    let postedPw = req.body.password;

    User.findOne({email: postedEmail}, function(err, result){
        if (err) {
            res.send("Failure: Query failed ");
        }
        else if(!result){
            res.send("600");
        }
        else{
            bcrypt.compare(postedPw, result.password, function(err, status){
                if(err){
                    console.log("Encryption comparison failed");
                }
                else if(status){
                    console.log("Passwords match");
                    const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                        algorithm: 'RS256',
                        expiresIn: 120,
                        
                    });
                    res.status(200).json({
                        idToken: jwtBearerToken, 
                        expiresIn: 120,
                        name: result.name,
                        email: result.email,
                      });
                }
                else{
                    res.send("500");
                }
            });
        }
    });
})

app.post('/delete', (req, res) => {
    let postedEmail = req.body.email;
    let resturantAddress = req.body.address;
    User.updateMany( {email: postedEmail}, { $pull: {favouriteResturants: {address: resturantAddress}}}, {new:true}, (err,resp) =>{
        if(err){
            console.log(err);
        }
        else{
            res.send(resp);
            console.log(resp);
        }
    })
})

app.post('/deleteAll', (req,res) => {
    User.update({}, { $set: { favouriteResturants: [] } }, {new: true}, (err,resp) => {
        if(err){
            console.log(err);
        }
        else{
            res.send(resp);
        }
    })
})


/* JWT Verification */
app.post('/home', (req, res) =>{
    const authHeader = req.headers['authorization']
    res.send(authHeader);
})

app.listen(process.env.PORT || 8080);

