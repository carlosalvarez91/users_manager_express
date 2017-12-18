const express = require('express');
const router = express.Router();

// User Model
let User = require('../models/user');
//Admin Model
let Admin = require('../models/admin');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_user', {
    title:'Add User'
  });
});

// Add Submit POST Route
router.post('/add', ensureAuthenticated,function(req, res){
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('password','password is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_user', {
      title:'Add User',
      errors:errors
    });
  } else {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','User Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('edit_user', {
      title:'Edit User',
      user:user
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id',ensureAuthenticated, function(req, res){
  let user = {};
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  let query = {_id:req.params.id}

  User.update(query, user, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'User Updated');
      res.redirect('/');
    }
  });
});

//Delete request
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}
  User.findById(req.params.id, function(err, user){
      User.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
  });
});

// Get Single User
router.get('/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
      res.render('user', {
        user:user
      });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/admins/login');
  }
}

module.exports = router;
