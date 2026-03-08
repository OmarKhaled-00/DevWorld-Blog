import postsController from "./posts.routes.js";

const postsModule = (app) => {
  postsController(app);
};

export default postsModule;
