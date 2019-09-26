const express = require('express')
const router = express.Router()

//Log in
router.get('/login', (req, res) => {
    res.render('user/login')
})

//Register
router.get('/register', (req, res) => {
    res.render('user/register')
})

//Creating user
router.post('/',  (req, res) => {
    res.send('Create')
})

module.exports = router