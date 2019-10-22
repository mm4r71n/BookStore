if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const validator = require('express-validator')
const mongoStore = require('connect-mongo')(session)

const indexRouter = require('./routes/index')
const bookRouter = require('./routes/books')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')
const wishlistRouter = require('./routes/wishlist')
const authorRouter = require('./routes/author')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

require('./config/passport')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))
app.use(cookieParser())
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new mongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180 * 60 * 1000}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated()
  res.locals.session = req.session
  next()
})

app.use('/user', userRouter)
app.use('/', indexRouter)
app.use('/books', bookRouter)
app.use('/cart', cartRouter)
app.use('/wishlist', wishlistRouter)
app.use('/authors', authorRouter)



app.listen(process.env.PORT || 3000)

