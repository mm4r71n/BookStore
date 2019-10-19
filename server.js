if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')

//express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

//express validator
app.use(express.json())

//express connect messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

const indexRouter = require('./routes/index')
const bookRouter = require('./routes/books')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')
const wishlistRouter = require('./routes/wishlist')
const authorRouter = require('./routes/author')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter)
app.use('/books', bookRouter)
app.use('/cart', cartRouter)
app.use('/user', userRouter)
app.use('/wishlist', wishlistRouter)
app.use('/authors', authorRouter)



app.listen(process.env.PORT || 3000)

