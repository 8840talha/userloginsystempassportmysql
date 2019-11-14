
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const db = require('./db');
//initialize step
app.use(bodyParser.json());
app.use('/',express.static('public'));
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: "I love salsa"}));
app.use(passport.initialize());
app.use(passport.session());



app.post('/login',passport.authenticate('local',{
    successRedirect:'/success',
    failureRedirect:'/signup.html'
}));

passport.use(new passportLocal(
 function(username,password,done) {

    db.getfromDb(username,function(pass){
    // console.log(pass);
    var pass = pass[0].password;
    bcrypt.compare(password, pass, function(err, res) {
        if(res){
            return done(null, username);
                    }
        else return done(null,false,{message:'wrong password'});

    });
   
})
 
   
}


));

passport.serializeUser(function(user,done){
    done(null, user);
});
passport.deserializeUser(function(user,done){
    done(null,user);
});


app.get('/success',function(req,res){
    res.send('Welcome'+req.user);
    });

app.post('/signup',function(req,res){
let name = req.body.username;
let password = req.body.password;

bcrypt.hash(password, saltrounds, function(err, hash) {
    // Store hash in your password DB.
    
    if(err) throw err;

    db.InsertintoDb(name,hash,function(){
        res.sendStatus(200);
});
  

});
});

    app.listen(5000, ()=>{
    console.log("server listening")
    db.connection.connect();
});