const passport = require('passport');
const Strategy = require('passport-github').Strategy;
const User = require('../db/models/user-model');

passport.serializeUser((user, done)=>{
    console.log('serializeUser',user)
    done(null, user.id)
});

passport.deserializeUser((id, done)=>{
    // find user in DB
    console.log(id);
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
},
async function(accessToken, refreshToken, profile, done) {

    try {
        const currentUser = await User.findOne({githubId: profile.id});
        if(currentUser) {
            console.log('existing user: ', currentUser);
            done(null, currentUser);
        } else {
            let avatarURL = profile.photos[0].value || null;

            const newUser = await new User({
                githubId: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                avatarURL
            }).save();

            console.log('created new user: ', newUser);
            done(null, newUser);
        }
    } catch (error) {
        done(err);
    }

}))