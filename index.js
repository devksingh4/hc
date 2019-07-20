const express = require('express')
const app = express()
const port = 8000 || process.env.port
const path = require('path')
const passport = require('passport')
app.use(passport.initialize())
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const exphbs = require('express-handlebars')
app.use(cookieSession({
    name: 'session',
    keys: ['6ADPh1qiwu2H16QBtFJzdLFLyIGZgtj3']
  }))

app.use(cookieParser())

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public'))) // public root
const auth = require('./auth/google.js') // auth configuration

auth(passport)

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // set the scope of authentication and have oauth screen shown 
  }))

app.get('/auth/google/callback',
  passport.authenticate('google', { // authenticate using google method, auth_failure is what page will be displayed if failure 
    failureRedirect: '/auth_failure',
    prompt: 'select_account' // always allow people to select account so people can select naperville203 account
  }),
  (req, res) => {
    req.session.uid = req.user.profile.id // set a session variable
    req.session.name = req.user.profile.name.givenName
    res.redirect('/') // redirect to root
  }
)

app.get('/auth_failure', (req, res) => {
    res.render('auth_failure')
}
)

app.get('/auth', (req, res) => {
    res.render('auth_landing')
}
)

app.get('/logout', (req, res) => {
    res.clearCookie('session')  // Clear session cookies, notify passport of the logout, and redirect to root. 
    res.clearCookie('session.uig')
    req.logOut()
    res.redirect('/')
}
)
app.post('/submitgamedata', (req, res) => {
  let uid = req.session.uid
  let dataArray = JSON.parse(req.query.data); // known issue: sending non utf-8 characters WILL BREAK this, but we have a catch
  if (uid) {
    console.log(dataArray)
    console.log(typeof(dataArray))
    res.sendStatus(200) // ok 
  } else {
    res.sendStatus(403) // forbiden 
  }

})
app.get('/', (req, res) => {
    let uid = req.session.uid
    let ruser_name = req.session.name
    if (uid) { // if the user is signed in
        res.render("index", {
          user_name: ruser_name.charAt(0).toUpperCase() + ruser_name.slice(1),
        }) // render app.handlebars which is in the views folder
    } else {
        res.render("auth_landing") // if the session does not contain the UID, then render the auth_landing to auth the user. 
    }
    }
)

app.get('*', (req, res) => {
    res.sendStatus(404)
  } 
)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))