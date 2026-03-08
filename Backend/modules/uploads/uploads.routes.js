import uploadController from "./uploads.controllers.js";
import { uploadDBController } from "./uploads.controllers.js";
const UploadRoutes = (app) => {
  app.post("/upload/cloud", uploadController);

  app.post("/upload/db", uploadDBController);
};

export default UploadRoutes;
