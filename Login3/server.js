if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const cors = require("cors");
const pool = require("./db");
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    //email => users.find(user => user.email === email),
    //id => users.find(user => user.id === id)
    async email =>{
        const user = await pool.query("SELECT email FROM users WHERE email=$1",
        [user.email]
        );
        return user
    } ,
    async id =>{
        const user = await pool.query("SELECT id FROM users WHERE id=$1",
        [user.id]
        );
        return user
    } 
  )

//   const newLogin = await pool.query("SELECT * FROM users WHERE email=$1",
//         [email]
//         );
  
//   const users = []
  
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(cors());
app.use(express.json());
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //   users.push({
    //     id: Date.now().toString(),
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: hashedPassword
    //   })
      const { name,email,password } = req.body;
        const newRegister = await pool.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
        [name,email,hashedPassword]
        );
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  app.listen(3000)