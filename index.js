const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const path = require('path')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const exphbs = require('express-handlebars')
const auth = require('./auth/google.js') // auth configuration
const bodyParser = require('body-parser')
const { check } = require('express-validator');

const aihandler = require('./handlers/aihandler.js')
const chathandler = require('./handlers/chathandler.js')
const identityhandler = require('./handlers/identityhandler.js')

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', () =>{
  console.log('User connected.')
})

app.use(cookieSession({
  name: 'session',
  keys: ['3e7yygruhefuhrbeuh3ruywaujgeger']
}))

app.use(passport.initialize())
app.use(cookieParser())

app.use(bodyParser())

app.use(express.json())

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public'))) // public root

auth(passport)

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // set the scope of authentication and have oauth screen shown 
}))

app.get('/survey', (req, res) => {
  if(req.session.uid) {
    res.render('survey')
  } else {
    res.status('404').render('404')
  }
})

app.get('/messages', (req, res) => {
  let lobby = chathandler.lobbiesFromUser(req.session.uid)[0]

  let chatHistory = []

  lobby.chat.forEach(chat => {
    chatHistory.push({
      name: chat.username,
      message: chat.message.message,
      uid: chat.uid,
      time: chat.time
    })
  })

  res.json(chatHistory)
})

app.post('/messages', [check('message').escape()], async(req, res) => {
  let message = req.body

  chathandler.newChat(req.session.name, req.session.uid, message, (lobby) => {
    message.time = identityhandler.getTime()
    io.emit(lobby.uid + '-chat', message)
  })

  res.json({})
})

app.get('/chat', (req, res) => {
  if(req.session.uid) {
    chathandler.joinLobby(req.session.name, req.session.uid, (lobby) => {
      res.render('chat', {
        name: req.session.name,
        listener: lobby.uid + '-chat',
        uid: req.session.uid
      })
    })
  } else {
    res.redirect('/auth')
  }
})

app.get('/result', (req, res) => {
  if(req.session.uid && req.session.score) {
    let depressed = `You possibly HAVE depression. You scored ${Math.round(req.session.score)}/100 on our test. It is advised that you seek help urgently.`
    let notDepressed = `You probably do NOT have depression. You scored ${Math.round(req.session.score)}/100 on our test.`
    let atRisk = `You are at risk for depression. You scored ${Math.round(req.session.score)}/100 on our test. You should increase your awareness and knowledge about depression to help avoid it.`

    if (req.session.score < 80 & req.session.score >= 60) {
    res.render('result', {
      message: atRisk
    })
    }
    else if(req.session.score < 60) {
      res.render('result', {
        message: depressed
      })
    } else {
      res.render('result', {
        message: notDepressed
      })
    }
  } else {
    res.redirect('/auth')
  }
})

app.post('/survey/submit', (req, res) => {
  if(req.session.uid) {
    let result = [
      req.body.interest,
      req.body.down,
      req.body.asleep,
      req.body.tired,
      req.body.appetite,
      req.body.feeling,
      req.body.concentrating,
      req.body.slow,
      req.body.death,
      req.body.difficulty,
      req.body.history
    ]
  
    result = result.map(x => parseInt(x))
  
    aihandler.evaluate(result, (result) => {
      req.session.score = result * 100
  
      res.redirect('/result')
    })
  } else {
    res.redirect('/auth')
  }
})

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
})

app.get('/auth', (req, res) => {
  res.render('auth_landing')
})

app.get('/logout', (req, res) => {
  res.clearCookie('session')  // Clear session cookies, notify passport of the logout, and redirect to root. 
  res.clearCookie('session.uig')
  req.logOut()
  res.redirect('/')
})

app.get('/', (req, res) => {
  let uid = req.session.uid
  let ruser_name = req.session.name
  if(uid) { // if the user is signed in
      res.render("index", {
        user_name: ruser_name.charAt(0).toUpperCase() + ruser_name.slice(1)
      }) // render app.handlebars which is in the views folder
  } else {
      res.render("auth_landing") // if the session does not contain the UID, then render the auth_landing to auth the user. 
  }
})

app.get('*', (req, res) => {
  res.sendStatus(404)
})

http.listen(port, () => console.log(`Example app listening on port ${port}!`))