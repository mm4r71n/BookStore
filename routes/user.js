const express = require('express')
const router = express.Router()
var csrf = require('csurf')
var passport = require('passport')
const User = require('../models/user');

var csrfProtection = csrf()
router.use(csrfProtection)

router.get('/profile', isLoggedIn, (req, res, next) => {
  var user = req.user
  res.render('user/profile', { 
    user: user
  })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout()
  res.redirect('/')
})

router.use('/', notLoggedIn, (req, res, next) => {
  next()
})

router.get('/signup', (req,res, next) => {
  var messages = req.flash('error')
  res.render('user/signup', {
      csrfToken: req.csrfToken(),
      messages: messages,
      hasErrors: messages.length > 0,
      user: new User()
  })
})
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/user/profile/',
  failureRedirect: '/user/signup',
  failureFlash: true
}))

router.get('/signin', (req, res, next) => {
  var messages = req.flash('error')
  res.render('user/signin', {
      csrfToken: req.csrfToken(),
      messages: messages,
      hasErrors: messages.length > 0
  })
})

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}))

module.exports = router

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function notLoggedIn(req, res, next) {
  if(!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
