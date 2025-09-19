import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { name } from "ejs";
import multer from "multer";
import session from "express-session";
import mainLogo from "./data/mainLogo.js";
import headerButtons from "./data/headerButtons.js";
import post from "./data/post.js";
import authors from "./data/authors.js";
import comments from "./data/comments.js";
import tags from "./data/tags.js";
import notifications from "./data/notifications.js";
import {
  userProfile,
  userProfileButtons,
  defaultUserProfile,
} from "./data/userProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: "mySecretKey", // change in production
    resave: false,
    saveUninitialized: true,
  })
);

// Pass global data to all views
app.use((req, res, next) => {
  res.locals.mainLogo = mainLogo;
  res.locals.headerButtons = headerButtons;
  res.locals.post = post;
  res.locals.authors = authors;
  res.locals.comments = comments;
  res.locals.tags = tags;
  res.locals.notifications = notifications;
  res.locals.userProfile = userProfile;
  res.locals.defaultUserProfile = defaultUserProfile;
  // res.locals.currentUser = req.session.user || defaultUserProfile;
  const user = req.session.user || defaultUserProfile;

  // Merge the user with default fallback for image
  res.locals.currentUser = {
    ...user,
    image: user.image || defaultUserProfile.image,
  };
  res.locals.userProfileButtons = userProfileButtons; // ✅ make available to EJS
  next();
});

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/submit", (req, res) => {
  const { username, password } = req.body;

  const user = userProfile.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.user = user; // save logged user
    res.redirect("/home");
  } else {
    res.render("index.ejs", { error: "Password or Username is not correct" });
  }
});

// Upload endpoint
app.post("/upload", upload.single("profilePhoto"), (req, res) => {
  if (!req.file) return res.send("No file uploaded");
  const imagePath = "/uploads/" + req.file.filename;
  //update session user
  req.session.user.image = imagePath;
  // update the actual user in userProfile array
  const user = userProfile.find(
    (u) => u.username === req.session.user.username
  );
  if (user) {
    user.image = imagePath;
  }
  res.redirect("/profile"); // redirect without query
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/create", (req, res) => {
  res.render("partials/create.ejs");
});
app.get("/profile", (req, res) => {
  res.render("partials/profile.ejs");
});
app.get("/home", (req, res) => {
  res.render("partials/home.ejs");
});

app.listen(port, () => {
  console.log(
    `Server is running on port : ${port}, Click Link: http://localhost:${port}`
  );
});
