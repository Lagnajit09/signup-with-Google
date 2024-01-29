const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const mongoose = require("mongoose");
const { User } = require("./db/db");
const session = require("express-session");

require("dotenv").config();
const mongodb_URL = process.env.MONGODB_URL;

const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect(mongodb_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the user schema
// const userSchema = new mongoose.Schema({
//   name: String,
// });

// const User = mongoose.model("User", userSchema);

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

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

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URI,
//       passReqToCallback: true,
//     },
//     function (req, issuer, profile, cb) {
//       User.findOne(
//         {
//           "federated_credentials.provider": issuer,
//           "federated_credentials.subject": profile.id,
//         },
//         function (err, user) {
//           if (err) {
//             return cb(err);
//           }
//           if (!user) {
//             // The Google account has not logged in to this app before.
//             // Create a new user record and link it to the Google account.
//             const newUser = new User({
//               name: profile.displayName,
//               federated_credentials: [
//                 {
//                   provider: issuer,
//                   subject: profile.id,
//                 },
//               ],
//             });

//             newUser.save(function (err, savedUser) {
//               if (err) {
//                 return cb(err);
//               }

//               const userData = {
//                 id: savedUser._id.toString(),
//                 name: savedUser.name,
//               };

//               return cb(null, userData);
//             });
//           } else {
//             // The Google account has previously logged in to the app.
//             // Get the user record linked to the Google account and log the user in.
//             return cb(null, user);
//           }
//         }
//       );
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
      passReqToCallback: true,
    },
    async function (req, issuer, profile, cb) {
      try {
        const user = await User.findOne({
          "federated_credentials.provider": issuer,
          "federated_credentials.subject": profile.id,
        });

        if (!user) {
          // The Google account has not logged in to this app before.
          // Create a new user record and link it to the Google account.
          const newUser = new User({
            name: profile.displayName,
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
        } else {
          // The Google account has previously logged in to the app.
          // Get the user record linked to the Google account and log the user in.
          return cb(null, user);
        }
      } catch (error) {
        return cb(error);
      }
    }
  )
);

// Express middleware to initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("client"));

app.get("/", function (req, res) {
  res.json({
    msg: "Welcome",
  });
});

// Express route for Google authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["openid", "profile", "email"] })
);

// Express route for Google callback
app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect to home.
    res.redirect("/");
  }
);

// Start the Express server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
