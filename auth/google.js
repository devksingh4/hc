const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const host = process.env.HOST || "localhost:8000"

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  passport.use(new GoogleStrategy({
    clientID: '178700293806-odj296qolcr24pb7fd8j28h8k3tp3ajl.apps.googleusercontent.com',
    clientSecret: "process.env.SCOUTING_CLIENT_SECRET",
    callbackURL: 'http://localhost:8000/auth/google/callback'
  },
  (token, refreshToken, profile, done) => {
    if(profile._json.hd === "naperville203.org" || profile._json.hd === "stu.naperville203.org"){ // this matching can be changed for different teams using the scouting app
      return done(null, {
        profile: profile,
        token: token
      })
    } else {
      // fail        
      done(new Error("User email not in authorized domain"));
  }        

  }))
}
