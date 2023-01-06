const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const { User } = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async function (accessToken, refreshToken, profile, done) {
      try {
        //  where: { id_social: profile.id },
        const loginUser = User.findOne({ id_social: profile.id });
        if (!loginUser) {
          const newUser = {
            name: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            password: null,
            phone: null,
            role: "636a6311c2e277ca644463fb",
            id_social: profile.id,
            social_provider: "google",
          };

          // Crear un nuevo usuario
          const user = new User(newUser);
          await user.save();

          return done(null, user);
        } else {
          return done(null, loginUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log(">>>>>>>>>>>>>>>serializeUser", user);

  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});
