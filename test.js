// const express = require("express");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oidc");
// const mongoose = require("mongoose");
// const { User } = require("./db/db");
// const session = require("express-session");

// require("dotenv").config();
// const mongodb_URL = process.env.MONGODB_URL;

// const app = express();

// // Connect to MongoDB using Mongoose
// mongoose.connect(mongodb_URL);

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// // Define the user schema
// // const userSchema = new mongoose.Schema({
// //   name: String,
// // });

// // const User = mongoose.model("User", userSchema);

// app.use(
//   session({
//     secret: process.env.SESSION_KEY,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// passport.serializeUser((user, done) => {
//   // Serialize user data, typically by saving the user ID
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     // Retrieve user data based on the user ID
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URI,
//       passReqToCallback: true,
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//       scope: [
//         "openid",
//         "profile",
//         "email",
//         "https://www.googleapis.com/auth/userinfo.profile",
//       ],
//     },
//     async function (req, issuer, profile, cb) {
//       try {
//         console.log(profile);
//         const user = await User.findOne({
//           "federated_credentials.provider": issuer,
//           "federated_credentials.subject": profile.id,
//         });

//         if (!user) {
//           // The Google account has not logged in to this app before.
//           // Create a new user record and link it to the Google account.
//           const newUser = new User({
//             name: profile.displayName,
//             profileImageUrl:
//               profile.photos && profile.photos.length > 0
//                 ? profile.photos[0].value
//                 : null, // Retrieve the profile image URL or set to null if not available
//             federated_credentials: [
//               {
//                 provider: issuer,
//                 subject: profile.id,
//               },
//             ],
//           });

//           const savedUser = await newUser.save();
//           const userData = {
//             id: savedUser._id.toString(),
//             name: savedUser.name,
//           };

//           return cb(null, userData);
//         } else {
//           // The Google account has previously logged in to the app.
//           // Get the user record linked to the Google account and log the user in.
//           return cb(null, user);
//         }
//       } catch (error) {
//         return cb(error);
//       }
//     }
//   )
// );

// // Express middleware to initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(express.json());

// app.use(express.static("client"));

// app.get("/", function (req, res) {
//   res.json({
//     msg: "Welcome",
//   });
// });

// // Express route for Google authentication
// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: [
//       "openid",
//       "profile",
//       "email",
//       "https://www.googleapis.com/auth/userinfo.profile",
//     ],
//   })
// );

// // Express route for Google callback
// app.get(
//   "/oauth2/redirect/google",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   function (req, res) {
//     // Successful authentication, redirect to home.
//     res.redirect("/profile");
//   }
// );

// app.post("/login", async (req, res) => {
//   const name = req.body.name;
//   const user = await User.findOne({ name });

//   if (!user) {
//     return res.status(400).json({
//       error: "Invalid credentials.",
//     });
//   }

//   req.session.user = user;
//   res.redirect("/profile");
// });

// // Example route for /profile
// app.get("/profile", (req, res) => {
//   //   console.log(req.session);

//   if (req.isAuthenticated()) {
//     // If the user is authenticated, display the profile with the profile picture
//     const user = req.user; // req.user contains the deserialized user object
//     // console.log(user);
//     res.send(`
//         <h1>Welcome, ${user.name}!</h1>
//         <img src="${user.profileImageUrl}" alt="Profile Picture">
//       `);
//   } else {
//     // If not authenticated, redirect to the login page
//     res.redirect("/login");
//   }
// });

// // Start the Express server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
