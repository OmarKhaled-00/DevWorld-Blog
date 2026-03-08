import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../database/db.js";

const registerAuthRoutes = (app) => {
  // Get the profile information from google
  // Google Sign Up
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  );
  // This what will happen after sign up or sign in with google , i have to control the behavior after hit this url
  app.get(
    "/auth/google/home",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:5173/",
      session: true,
    }),
    (req, res) => {
      // ✅ YOU decide where frontend goes
      res.redirect("http://localhost:5173/home");
    },
  );

  // Sign in with google and then redirect
  app.post(
    "/signIn",
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/",
    }),
  );

  // Log out and clear the session
  app.post("/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);

      // Destroy session
      req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("connect.sid", {
          path: "/",
        });

        res.status(200).json({
          success: true,
          message: "Successfully logged out",
        });
      });
    });
  });

  // Local Sign Up

  app.post("/auth/local/signUp", async (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const password = req.body.password;
    console.log(
      `Recieved from body ${first_name} , ${last_name} ,${username} ,${password} `,
    );
    // Check if there is user with that email in database
    try {
      console.log("Checking if the user is existed...");
      const response = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      if (response.rows.length > 0) {
        console.log("User is Existed...");
        const user = response.rows[0];
        return res
          .status(403)
          .json({ message: "User is already Existed.", success: false, user });
      } else {
        try {
          // Create new User
          const userToken = jwt.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: "6m",
          });

          const userApi = uuidv4();
          const strongHashedPassword = await bcrypt.hash(password, 10);

          const data = await db.query(
            "INSERT INTO users(api_key,f_name,l_name,username,password,token_key,provider) VALUES ($1,$2,$3,$4,$5,$6,$7)  RETURNING id, api_key, f_name, l_name, username, password, token_key, provider",
            [
              userApi,
              first_name,
              last_name,
              username,
              strongHashedPassword,
              userToken,
              "local",
            ],
          );
          const newUser = data.rows[0];

          console.log("newUser from Backend: ", newUser);
          return res.status(200).json({
            message: "new user is being created",
            success: true,
            newUser,
          });
        } catch (err) {
          return res.status(500).json("Error inserting user to data...");
        }
      }
    } catch (err) {
      return res.status(400).json("Error Fething Data...");
    }
  });

  // Local Sign in
  app.post("/auth/local/signIn", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server error",
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Login failed",
          });
        }

        return res.status(200).json({
          success: true,
          user,
        });
      });
    })(req, res, next);
  });

  // function isAuth(req, res, next) {
  //   if (req.isAuthenticated()) return next();
  //   res.status(401).json({ message: "Unauthorized" });
  // }
  // app.get("/home", (req, res) => {
  //   // console.log("/home here");
  //   // res.redirect("http://localhost:5173/home");
  //   if (req.isAuthenticated()) {
  //     console.log("/home here");
  //     res.status(202).json({ message: "Session true" });
  //   }
  //   res.status(402).json({ message: "Session false" });
  // });

  app.get("/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      console.log("IsAuthenticated: ", req.isAuthenticated());

      return res.json({
        success: true,
        user: {
          id: req.user.id,
          f_name: req.user.f_name,
          l_name: req.user.l_name,
          apikey: req.user.apikey,
          email: req.user.username,
          provider: req.user.provider,
        },
      });
    }
    console.log("IsAuthenticated: ", req.isAuthenticated());
    return res.json({
      success: false,
      message: "Not authenticated",
    });
  });
};

export default registerAuthRoutes;
