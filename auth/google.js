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
    clientID: '55494963706-k03744kitb4ma77aajdfjrkh56h00pii.apps.googleusercontent.com',
    clientSecret: "3bAxrfgUVxza9IKPVZbljQMu",
    callbackURL: host + '/auth/google/callback'
  },
  (token, refreshToken, profile, done) => {
    return done(null, {
      profile: profile,
      token: token
    })       
  }))
}
