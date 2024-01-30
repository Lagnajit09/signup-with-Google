const express = require("express");
const passport = require("passport");
const session = require("express-session");
// const GoogleStrategy = require("passport-google-oidc");
const mongoose = require("mongoose");
const { User } = require("./db/db");

require("dotenv").config();
const mongodb_URL = process.env.MONGODB_URL;

const app = express();
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(mongodb_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

var GoogleStrategy = require("passport-google-oauth2").Strategy;

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  // Serialize user data, typically by saving the user ID
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve user data based on the user ID
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, issuer, refresh, profile, cb) {
      console.log(profile.id);

      try {
        const existingUser = await User.findOne({
          name: profile.displayName,
          //   "federated_credentials.provider": issuer,
          "federated_credentials.subject": profile.id,
        });

        if (existingUser) {
          // If the user already exists, return the existing user
          return cb(null, existingUser);
        }

        // The user does not exist, create a new user record
        const newUser = new User({
          name: profile.displayName,
          profileImageUrl:
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : null,
          federated_credentials: [
            {
              provider: issuer,
              subject: profile.id,
            },
          ],
        });

        const savedUser = await newUser.save();
        const userData = {
          id: savedUser._id.toString(),
          name: savedUser.name,
        };

        return cb(null, userData);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Route for handling the Google callback after authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {
    // Successful authentication, redirect to the profile page
    res.redirect("/profile");
  }
);

app.get("/login", (req, res) => {
  // Check if the user is already authenticated
  if (req.isAuthenticated()) {
    // If authenticated, redirect to the profile page
    res.redirect("/profile");
  } else {
    // If not authenticated, initiate Google authentication
    passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
  }
});
app.get("/profile", (req, res) => {
  //   console.log(req.session);

  if (req.isAuthenticated()) {
    // If the user is authenticated, display the profile with the profile picture
    const user = req.user; // req.user contains the deserialized user object
    console.log(user);
    res.send(`
        <h1>Welcome, ${user.name}!</h1>
        <img src="${user.profileImageUrl}" alt="Profile Picture">
      `);
  } else {
    // If not authenticated, redirect to the login page
    res.redirect("/login");
  }
});

// Start the Express server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
