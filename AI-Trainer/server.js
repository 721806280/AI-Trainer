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
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const initializePassport = require('./passport-config')
initializePassport(
    passport,
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

var request = require('request');
var Cookie = require('request-cookies').Cookie;
  
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(cors());
app.use(express.json());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(cookieParser())

app.use(express.static(__dirname + '/views'));
  
app.get('/', checkAuthenticated, (req, res) => {

  res.render('index.ejs', { name: req.user.name, email:req.user.email })
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

app.get('/physio-shoulder1', checkAuthenticated, (req, res) => {

  res.render('test.ejs')
})

  
app.post('/register', checkNotAuthenticated, async (req, res) => {

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const { name,email,password } = req.body;
    const newRegister = await pool.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",[name,email,hashedPassword]);

    const newProfile = await pool.query("INSERT INTO profile (email) VALUES ($1) RETURNING *",[email]);
    res.redirect('/login')

  }catch{

    res.redirect('/register')
  }
})
  
app.delete('/logout', (req, res) => {

  req.logOut()
  res.redirect('/login')
})

app.get('/profile', checkAuthenticated, async(req, res) => {
  
  try {

    const newRegister = await pool.query("SELECT * FROM profile WHERE email=$1 ",
    [req.cookies.email]
    );
    res.render('profile.ejs',{prof : newRegister})

    }catch (error) {

      console.error(error.message);
    }
    res.end();
})

app.get('/updateProfile', checkAuthenticated, async(req, res) => {

  try {

    const newRegister = await pool.query("SELECT * FROM profile WHERE email=$1",
    [req.cookies.email]
    );
    res.render('updateprofile.ejs',{prof : newRegister})

    }catch (error) {
      console.error(error.message);
    }
    res.end();
})

app.post('/updateProfile',urlencodedParser, checkAuthenticated, async(req, res) => {

  try {

    const { name,phone,age,weight,height,Specify,gender,checkArr } = req.body;
    const newRegister = await pool.query("UPDATE profile SET name=$1, phone = $2 , age = $3 , weight = $4 , height = $5 , specify = $6 , gender = $7 , region = $8 WHERE email=$9 RETURNING *",
    [name,phone,age,weight,height,Specify,gender,checkArr.toString(),req.cookies.email]
    );

    }catch (error) {
      console.error(error.message);
    }

    
      res.redirect('/profile')
})


//If user is not authenticated redirect them to the login page.  
function checkAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

//If user is authenticated redirect them to the home page.
function checkNotAuthenticated(req, res, next) {
  
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
  

//PORT 3000
app.listen(3000)