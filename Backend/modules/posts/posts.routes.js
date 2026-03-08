import db from "../database/db.js";

const postsController = (app) => {
  app.post("/create/posts", async (req, res) => {
    const { user_id, content_json, content_text, visibility, status, title } =
      req.body;
    try {
      const newpost = await db.query(
        "INSERT INTO posts(user_id,content_json,content_text,visibility,status,title) VALUES($1,$2,$3,$4,$5,$6) RETURNING  * ",
        [user_id, content_json, content_text, visibility, status, title],
      );
      res.status(200).json({
        success: true,
        message: "Post created successfully",
        post: newpost.rows[0],
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed Create Post..." });
    }
  });

  app.get("/get/posts", async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(userId);
      const posts = await db.query(
        `
      SELECT 
        posts.id,
        posts.title,
        posts.content_text,
        posts.created_at,

        -- Author info
        json_build_object(
          'id', users.id,
          'f_name', users.f_name,
          'l_name', users.l_name
        ) AS author,

        -- User info
        json_build_object(
        'img_url', users_info.img_url,
        'career' , users_info.career
        )As user_info,

        -- Post tags
          (
              SELECT json_build_object(
              'id', pt.id,
              'tagname', pt.tag_name
          )
              FROM posts_tags pt
              WHERE pt.post_id = posts.id
              LIMIT 1
            ) AS post_tag,
 

        EXISTS(
        SELECT 1 FROM posts_likes
        WHERE posts_likes.post_id = posts.id
        AND posts_likes.user_id = $1
        )AS liked_by_user,

         EXISTS(
        SELECT 1 FROM posts_trend
        WHERE posts_trend.post_id = posts.id
        AND posts_trend.user_id = $1
        )AS trended_by_user,

        -- Likes count
        COUNT(DISTINCT posts_likes.id) AS likes_count,

        -- Views count
        COUNT(DISTINCT posts_views.id) AS views_count,

          -- Trend Score 
        COALESCE(ptr.trend_score, 0) AS trend_score,


        -- post media array
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', posts_media.id,
              'post_id', posts_media.post_id,
              'media_type', posts_media.media_type,
              'mime_type' , posts_media.mimi_type,
              'url', posts_media.url
            )
          ) FILTER (WHERE posts_media.id IS NOT NULL),
          '[]'
        ) AS post_media

      FROM posts

      JOIN users 
        ON posts.user_id = users.id

      LEFT JOIN posts_likes 
        ON posts_likes.post_id = posts.id

      LEFT JOIN posts_views 
        ON posts_views.post_id = posts.id

      LEFT JOIN posts_trend
        ON posts_trend.post_id = posts.id

      LEFT JOIN posts_media
        ON posts_media.post_id = posts.id

      -- 🔥 join trending view
      LEFT JOIN post_trending ptr 
        ON ptr.post_id = posts.id


      LEFT JOIN users_info
        ON users_info.user_id = users.id

      WHERE posts.status = 'active'
        AND posts.visibility = 'public'

      GROUP BY posts.id, users.id , users_info.id ,ptr.trend_score
      ORDER BY posts.created_at DESC
    `,
        [userId],
      );

      res.status(200).json({
        success: true,
        posts: posts.rows,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed Get Posts...",
      });
    }
  });

  app.get("/get/tags", async (req, res) => {
    try {
      const tags = await db.query("SELECT * FROM tags");
      res.status(200).json({
        success: true,
        tags: tags.rows,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed Get tags..." });
    }
  });

  app.get("/get/likes/:post_id", async (req, res) => {
    const { post_id } = req.params;
    try {
      const TotalLikes = await db.query(
        "SELECT COUNT(*) FROM posts_likes WHERE post_id =$1",
        [post_id],
      );
      res.status(200).json({
        success: true,
        TotalLikes: TotalLikes.rows,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed Get Likes..." });
    }
  });

  app.get("/get/userInfo/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
      const userInfo = await db.query(
        "SELECT * FROM users_info WHERE user_id =$1",
        [user_id],
      );
      res.status(200).json({
        success: true,
        userInfo: userInfo.rows,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed Get Likes..." });
    }
  });

  // add tag for specfic post

  app.post("/add/tags/:postId", async (req, res) => {
    const { postId } = req.params;
    const selected_tags = req.body;
    console.log("tags in backend: ", selected_tags);

    if (!Array.isArray(selected_tags) || selected_tags.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tags must be array" });
    }

    try {
      const result = await db.query(
        `
      INSERT INTO posts_tags (post_id, tag_name)
      SELECT $1, UNNEST($2::text[])
      RETURNING *
      `,
        [postId, selected_tags],
      );

      return res.status(200).json({
        success: true,
        message: "Tags added successfully.",
        tags: result.rows,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed Add Tags..." });
    }
  });

  app.post("/like/:post_id/:user_id", async (req, res) => {
    const { post_id, user_id } = req.params;

    let liked;
    // Check if the user already liked the post
    const check = await db.query(
      "SELECT * FROM posts_likes WHERE post_id = $1 AND user_id = $2",
      [post_id, user_id],
    );
    console.log("inside like route check is: ", check.rows.length);
    // already the user liked this post
    if (check.rows.length > 0) {
      //Remove the like (dislike)
      await db.query(
        "DELETE FROM posts_likes WHERE post_id = $1 AND user_id = $2",
        [post_id, user_id],
      );
      liked = false;
    } else {
      // User hasn't liked , add the like
      await db.query(
        "INSERT INTO posts_likes(post_id,user_id) VALUES($1,$2) ",
        [post_id, user_id],
      );
      liked = true;
    }
    // Fetch all likes
    // const stats = await db.query(
    //   "SELECT array_agg(user_id) AS users_id , COUNT(user_id) AS total_likes FROM posts_likes WHERE post_id=$1",
    //   [post_id],
    // );

    const stats = await db.query(
      "SELECT  COUNT(*) AS total_likes FROM posts_likes WHERE post_id=$1",
      [post_id],
    );

    console.log(stats.rows[0]);
    return res.status(200).json({
      success: true,
      message: "Post is Liked successfully.",
      post_status: stats.rows[0],
      liked,
    });
  });

  app.post("/trend/:post_id/:user_id", async (req, res) => {
    const { post_id, user_id } = req.params;

    let trended;
    // Check if the user already liked the post
    const check = await db.query(
      "SELECT * FROM posts_trend WHERE post_id = $1 AND user_id = $2",
      [post_id, user_id],
    );
    // already the user liked this post
    if (check.rows.length > 0) {
      //Remove the like (dislike)
      await db.query(
        "DELETE FROM posts_trend WHERE post_id = $1 AND user_id = $2",
        [post_id, user_id],
      );
      trended = false;
    } else {
      // User hasn't liked , add the like
      await db.query(
        "INSERT INTO posts_trend(post_id,user_id) VALUES($1,$2) ",
        [post_id, user_id],
      );
      trended = true;
    }
    // Fetch all likes
    const stats = await db.query(
      "SELECT array_agg(user_id) AS users_id , COUNT(user_id) AS total_trend FROM posts_trend WHERE post_id=$1",
      [post_id],
    );

    console.log(stats.rows[0]);
    return res.status(200).json({
      success: true,
      message: "Post is trended successfully.",
      post_status: stats.rows[0],
      trended,
    });
  });

  app.post("/fetch/post/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { content_text } = req.body;

    console.log("USER_ID:", user_id, typeof user_id);
    console.log("CONTENT_TEXT:", content_text);
    console.log(req.body);

    try {
      const postByUser = await db.query(
        `
      SELECT id
      FROM posts
      WHERE user_id = $1
        AND content_text ILIKE $2
      `,
        [user_id, `%${content_text}%`],
      );

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully.",
        post_id: postByUser.rows,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Failed Fetch Post..." });
    }
  });
};

export default postsController;
