import session from "express-session";
import passport from "passport";
import initPassport from "./auth.passport.js";
import registerAuthRoutes from "./auth.routes.js";

const registerAuthModule = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60, // 1hr and cookie will be expired
        httpOnly: true, // Prevent xss penteration and reading the cookie by js
        secure: process.env.NODE_ENV === "production", //if false , security will be false
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  initPassport();
  registerAuthRoutes(app);
};

export default registerAuthModule;
