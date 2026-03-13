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
    posts.content_json,
    posts.created_at,
    posts.visibility,
    

    -- Author info
    json_build_object(
        'id', users.id,
        'f_name', users.f_name,
        'l_name', users.l_name
    ) AS author,

    -- User additional info
    json_build_object(
        'img_url', users_info.img_url,
        'career', users_info.career
    ) AS user_info,

  -- All post tags as an array
(
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', pt.id,
                'tagname', pt.tag_name
            )
        ),
        '[]'
    )
    FROM posts_tags pt
    WHERE pt.post_id = posts.id
) AS post_tag,

    -- Post interactions by current user
    EXISTS(
        SELECT 1 FROM posts_likes pl
        WHERE pl.post_id = posts.id AND pl.user_id = $1
    ) AS liked_by_user,

    EXISTS(
        SELECT 1 FROM posts_trend pt
        WHERE pt.post_id = posts.id AND pt.user_id = $1
    ) AS trended_by_user,

    EXISTS(
        SELECT 1 FROM posts_repost pr
        WHERE pr.post_id = posts.id AND pr.user_id = $1
    ) AS reposted_by_user,

    EXISTS(
        SELECT 1 FROM posts_saved ps
        WHERE ps.post_id = posts.id AND ps.user_id = $1
    ) AS saved_by_user,

    -- Followed by current user
    (uf_current.follower_id IS NOT NULL) AS followed_by_user,

   -- Post belongs to user
    (posts.user_id = $1) AS post_belong_to_user,

    -- Counts
    COUNT(DISTINCT pl.id) AS likes_count,
    COUNT(DISTINCT pv.id) AS views_count,
    COUNT(DISTINCT pr.id) AS repost_count,

    -- Trend score
    COALESCE(ptr.trend_score, 0) AS trend_score,

    -- Post media array
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', pm.id,
                'post_id', pm.post_id,
                'media_type', pm.media_type,
                'mime_type', pm.mimi_type,
                'url', pm.url
            )
        ) FILTER (WHERE pm.id IS NOT NULL),
        '[]'
    ) AS post_media

FROM posts

-- Post author
JOIN users 
    ON posts.user_id = users.id

-- Author additional info
LEFT JOIN users_info
    ON users_info.user_id = users.id

-- Whether current user follows this author
LEFT JOIN user_follows uf_current
    ON uf_current.follower_id = $1
    AND uf_current.following_id = users.id

-- Post interactions
LEFT JOIN posts_likes pl
    ON pl.post_id = posts.id

LEFT JOIN posts_views pv
    ON pv.post_id = posts.id

LEFT JOIN posts_repost pr
    ON pr.post_id = posts.id

LEFT JOIN posts_saved ps
    ON ps.post_id = posts.id

LEFT JOIN posts_trend pt
    ON pt.post_id = posts.id

LEFT JOIN posts_media pm
    ON pm.post_id = posts.id

-- Trending score
LEFT JOIN post_trending ptr
    ON ptr.post_id = posts.id

WHERE posts.status = 'active'
  AND (posts.visibility = 'public' OR posts.visibility = 'followers')

GROUP BY posts.id, users.id, users_info.id, ptr.trend_score, uf_current.follower_id

ORDER BY posts.created_at DESC;
    `,
        [userId],
      );

      res.status(200).json({
        success: true,
        posts: posts.rows,
      });
    } catch (err) {
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

    return res.status(200).json({
      success: true,
      message: "Post is trended successfully.",
      post_status: stats.rows[0],
      trended,
    });
  });

  app.post("/repost/:post_id/:user_id", async (req, res) => {
    let reposted = false;
    const { post_id, user_id } = req.params;
    try {
      // Check if the user already liked the post
      const check = await db.query(
        "SELECT * FROM posts_repost WHERE post_id = $1 AND user_id = $2",
        [post_id, user_id],
      );
      // already the user liked this post
      if (check.rows.length > 0) {
        //Remove the like (dislike)
        await db.query(
          "DELETE FROM posts_repost WHERE post_id = $1 AND user_id = $2",
          [post_id, user_id],
        );
        reposted = false;
      } else {
        await db.query(
          "INSERT INTO posts_repost(post_id,user_id) VALUES($1,$2) ",
          [post_id, user_id],
        );
        reposted = true;
      }

      const stats = await db.query(
        "SELECT COUNT(*) AS total_repost FROM posts_repost WHERE post_id = $1",
        [post_id],
      );

      return res.status(200).json({
        success: true,
        message: "Post is reposted successfully.",
        post_status: stats.rows[0],
        reposted,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed while reposting.",
      });
    }
  });

  app.post("/save/post/:post_id/:user_id", async (req, res) => {
    let saved = false;
    const { post_id, user_id } = req.params;
    try {
      // Check if the user already liked the post
      const check = await db.query(
        "SELECT * FROM posts_saved WHERE post_id = $1 AND user_id = $2",
        [post_id, user_id],
      );
      // already the user liked this post
      if (check.rows.length > 0) {
        //Remove the like (dislike)
        await db.query(
          "DELETE FROM posts_saved WHERE post_id = $1 AND user_id = $2",
          [post_id, user_id],
        );
        saved = false;
      } else {
        await db.query(
          "INSERT INTO posts_saved(post_id,user_id) VALUES($1,$2) ",
          [post_id, user_id],
        );
        saved = true;
      }

      return res.status(200).json({
        success: true,
        message: "Post is saved successfully.",
        saved,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed while saving.",
      });
    }
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
      if (process.env.NODE_ENV === "development") {
        console.log(err);
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed Fetch Post..." });
    }
  });

  app.delete("/unfollow/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const logged_user = req.user.id;
    try {
      await db.query(
        "DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2  ",
        [logged_user, user_id],
      );
      return res.status(200).json({
        success: true,
        message: "User is removed from following.",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Failed unfollow user..." });
    }
  });
  app.post("/follow/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const logged_user = req.user.id;
    try {
      await db.query(
        "INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT (follower_id, following_id) DO NOTHING",
        [logged_user, user_id],
      );
      return res.status(200).json({
        success: true,
        message: "User is added successfully.",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Failed follow user..." });
    }
  });
};

export default postsController;
