import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { name } from "ejs";
/* If you will use these files in all project files */
import mainLogo from "./data/mainLogo.js";
import headerButtons from "./data/headerButtons.js";
import post from "./data/post.js";
import authors from "./data/authors.js";
import comments from "./data/comments.js";
import tags from "./data/tags.js";
import notifications from "./data/notifications.js";
import { userProfile, userProfileButtons } from "./data/userProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
  res.locals.userProfileButtons = userProfileButtons; // ✅ make available to EJS
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}.`);
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

app.post("/submit", (req, res) => {
  if (
    req.body["username"] === "@omarKhaled" &&
    req.body["password"] === "123"
  ) {
    res.render("partials/home.ejs");
  } else {
    res.render("index.ejs", { error: "Password or Username is not correct" });
  }
});
