// ====================
// server
// ====================
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import session from "express-session";
import fs from "fs";
import { collectHomeData } from "./utils/collectHomeData.js";
// Import static UI configs
import mainLogo from "./data/mainLogo.js";
import headerButtons from "./data/headerButtons.js";
import tags from "./data/tags.js";
import notifications from "./data/notifications.js";
import { userProfileButtons } from "./data/userProfileButtons.js";
// --------------------
// Setup
// --------------------
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

// --------------------
// Load user data
// --------------------
const userProfilePath = "./data/userProfile.json";

// Load JSON helper
function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
let userProfile = loadJSON(userProfilePath);

// Default guest
const defaultUserProfile = {
  name: "Guest User",
  email: "guest@example.com",
  username: "@guest",
  image: "/images/no-image.jpg",
};

// Pass global data to all views
app.use((req, res, next) => {
  res.locals.mainLogo = mainLogo;
  res.locals.headerButtons = headerButtons;
  res.locals.tags = tags;
  res.locals.userProfile = userProfile;
  res.locals.userProfileButtons = userProfileButtons;
  res.locals.notifications = notifications;
  res.locals.defaultUserProfile = defaultUserProfile;
  // res.locals.currentUser = req.session.user || defaultUserProfile;
  const user = req.session.user || defaultUserProfile;

  // Merge the user with default fallback for image
  res.locals.currentUser = {
    ...user,
    image: user.image || defaultUserProfile.image,
  };
  next();
});

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
//login
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

// Upload endpoint → update JSON file too
app.post("/upload", upload.single("profilePhoto"), (req, res) => {
  if (!req.file) return res.send("No file uploaded");

  const imagePath = "/uploads/" + req.file.filename;

  if (req.session.user) {
    req.session.user.image = imagePath;

    // update actual user in userProfile.json
    const userIndex = userProfile.findIndex(
      (u) => u.username === req.session.user.username
    );
    if (userIndex !== -1) {
      userProfile[userIndex].image = imagePath;
      saveJSON(userProfilePath, userProfile); // save back to file
    }
  }

  res.redirect("/profile");
});

// Routes
app.get("/", (req, res) => res.render("index.ejs"));
app.get("/create", (req, res) => res.render("partials/create.ejs"));
app.get("/profile", (req, res) => res.render("partials/profile.ejs"));
app.get("/home", (req, res) => {
  const loggedInUser = req.session.user || null;
  const { allPosts, tagsList, recentComments, featuredAuthors, trendPost } =
    collectHomeData(loggedInUser);
  res.render("partials/home.ejs", {
    posts: allPosts,
    tags: tagsList,
    comments: recentComments,
    authors: featuredAuthors,
    trendPost: trendPost,
  });
});

app.listen(port, () => {
  console.log(
    `Server is running on port : ${port}, Click Link: http://localhost:${port}`
  );
});
app.get("/healthz", (req, res) => res.status(200).send("OK"));
