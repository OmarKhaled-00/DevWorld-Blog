import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../database/db.js";

const init_passport = () => {
  // Local Strategy
  // Google Sign in
  passport.use(
    "local",
    new Strategy(async function verify(username, password, callBack) {
      // Check for username in db
      try {
        console.log("Looking for user in database...");
        const response = await db.query(
          "SELECT * FROM users WHERE username = $1",
          [username],
        );

        if (response.rows.length > 0) {
          const user = response.rows[0];
          const hashedPassword = user.password;
          await bcrypt.compare(password, hashedPassword, (err, valid) => {
            if (err) {
              console.log("Error Check Matching Password: ", err);
            }
            if (valid) {
              return callBack(null, user);
            } else {
              return callBack(null, false);
            }
          });
        } else {
          return callBack(null, false, "User not found.");
        }
      } catch (err) {
        console.log("Error in Local-Strategy Finding Username in db: ", err);
        return callBack(err);
      }
    }),
  );

  // Goggle Strategy
  // Google Sign Up
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        userProfileUrl: process.env.USER_PROFILE_URL,
      },
      async (_, __, profile, callBack) => {
        console.log(profile);
        const email = profile.email;
        // Look for this email in database , to see if it's already exist
        try {
          console.log("Lookin in the database");
          const response = await db.query(
            "SELECT * FROM users WHERE username = $1",
            [email],
          );
          if (response.rows.length > 0) {
            // if it's already exist
            const existedUser = response.rows[0];
            return callBack(null, existedUser);
          } else {
            // Create the email in devWorld
            const userToken = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: "6m",
            });
            const userApi = uuidv4();

            const StronghashedPassword = await bcrypt.hash(email, 10);
            const data = await db.query(
              "INSERT INTO users(api_key,f_name,l_name,username,password,token_key,provider) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, api_key , f_name, l_name, username, password, token_key,provider;",
              [
                userApi,
                profile.given_name,
                profile.family_name,
                profile.email,
                StronghashedPassword,
                userToken,
                "google",
              ],
            );
            console.log(data.rows[0]);
            return callBack(null, data.rows[0]);
          }
        } catch (err) {
          console.log("Error in Goggle_Strategy Finding Email: ", err);
          return callBack(err);
        }
      },
    ),
  );
};

passport.serializeUser((user, callBack) => {
  callBack(null, user);
});

passport.deserializeUser((user, callBack) => {
  callBack(null, user);
});

export default init_passport;
