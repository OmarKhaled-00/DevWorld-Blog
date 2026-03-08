import express from "express";
import cors from "cors";
import env from "dotenv";
import fileUpload from "express-fileupload";
import UploadRoutes from "./modules/uploads/uploads.routes.js";
import registerAuthModule from "./modules/auth/auth.module.js";
import postsModule from "./modules/posts/posts.module.js";
import path from "path";
const tmpDir = path.join(
  "F:/Drive_2/WebDevelopment/Graduation_Projects/DevWorld/Dev-World-Blog/Backend",
  "tmp",
);
const app = express();
env.config();
const SERVER_PORT = process.env.SECRET_PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  }),
);
app.use(
  fileUpload({
    useTempFiles: true, // memory-based
    tempFileDir: tmpDir, // Windows temp folder (must exist)
    createParentPath: true, // auto-create folder if missing
    limits: { fileSize: 200 * 1024 * 1024 }, // 100MB (adjust)
  }),
);
registerAuthModule(app);
UploadRoutes(app);
postsModule(app);

app.listen(`${SERVER_PORT}`, () => {
  console.log(`Server running on : http://localhost:${SERVER_PORT} `);
});
