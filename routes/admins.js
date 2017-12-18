const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in Admin Model
let Admin = require('../models/admin');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register POST
router.post('/register', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
    let newAdmin = new Admin({
      email:email,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newAdmin.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newAdmin.password = hash;
        newAdmin.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','You are now registered and can log in');
            res.redirect('/admins/login');
          }
        });
      });
    });
  
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login POST
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/admins/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/admins/login');
});

module.exports = router;
