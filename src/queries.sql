-- Visibility type
CREATE TYPE visibility_enum AS ENUM ('public', 'private', 'followers');

-- Status type
CREATE TYPE status_enum AS ENUM ('active', 'draft');

-- Post Media Type
CREATE TYPE media_enum AS ENUM ('image', 'video','application'); --not document  => application


CREATE TABLE posts(
	
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	content_json JSONB NOT NULL,
	content_text TEXT NOT NULL,
	visibility visibility_enum DEFAULT 'public',
    status status_enum DEFAULT 'active',
	created_at TIMESTAMP DEFAULT now(),
	updated_at TIMESTAMP DEFAULT now()

);

CREATE TABLE posts_likes(

	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT now(),
	UNIQUE(post_id,user_id)
);

CREATE TABLE posts_repost(
	
	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT now(),
	UNIQUE(post_id,user_id)

);

CREATE TABLE posts_saved(
	
	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT now(),
	UNIQUE(post_id,user_id)

);


CREATE TABLE posts_trend (

	
	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT now(),
	UNIQUE(post_id,user_id)

);


CREATE TABLE posts_comments (
	
	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    content_text TEXT,
	parent_id BIGINT NULL,
	created_at TIMESTAMP DEFAULT now()

);



CREATE TABLE posts_views (

	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
	user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT now(),
	UNIQUE(post_id,user_id)
	
);

CREATE TABLE posts_media (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  media_type media_enum ,
  mimi_type TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- tags
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);


INSERT INTO tags(name)
VALUES
('Frontend'),
('Backend'),
('Full Stack'),
('DevOps'),
('Cloud'),
('System Design'),
('Algorithms'),
('Data Structures'),
('Security'),
('Testing'),
('Databases'),
('AI / ML')
ON CONFLICT (name) DO NOTHING;  -- avoids duplicates

-- Last Tag Updated
CREATE TABLE posts_tags (
id BIGSERIAL NOT NULL,
	post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
	tag_name TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()

)
-- CREATE TABLE posts_tags (
--   post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
--   tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
--   PRIMARY KEY (post_id, tag_id)
-- );

CREATE TABLE user_follows (
  id BIGSERIAL PRIMARY KEY,
  follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id <> following_id)  -- prevent self-follow
);



-- Indexes
-- VIEWS
CREATE UNIQUE INDEX posts_views_post_user
ON posts_views(post_id, user_id);
CREATE INDEX posts_views_post
ON posts_views(post_id);

-- LIKES
CREATE UNIQUE INDEX posts_likes_post_user
ON posts_likes(post_id, user_id);
CREATE INDEX posts_likes_post
ON posts_likes(post_id);

-- REPOSTS
CREATE UNIQUE INDEX posts_repost_post_user
ON posts_repost(post_id, user_id);
CREATE INDEX posts_repost_post
ON posts_repost(post_id);

-- SAVED
CREATE UNIQUE INDEX posts_saved_post_user
ON posts_repost(post_id, user_id);
CREATE INDEX posts_saved_post
ON posts_repost(post_id);

-- TREND clicks
CREATE UNIQUE INDEX posts_trend_post_user
ON posts_trend(post_id, user_id);
CREATE INDEX posts_trend_post
ON posts_trend(post_id);

-- COMMENTS
CREATE INDEX posts_comments_post
ON posts_comments(post_id);
CREATE INDEX posts_comments_parent
ON posts_comments(parent_id);

-- Post Media
CREATE INDEX idx_post_media_post ON posts_media(post_id);
CREATE INDEX idx_post_media_type ON posts_media(media_type);
-- ---------------------------------------------------------------------------
-- Get all tags for a post
-- CREATE INDEX idx_posts_tags_post ON posts_tags(post_id);
-- Get all posts with a tag
-- CREATE INDEX idx_posts_tags_tag ON posts_tags(tag_id);
-- last tag index updated
CREATE INDEX idx_posts_tags_post ON posts_tags(post_id);
CREATE INDEX idx_posts_tags_tag ON posts_tags(id);
-- ---------------------------------------------------------------------------
-- Who a user is following
CREATE INDEX idx_user_follows_follower
ON user_follows(follower_id);

-- Who follows a user
CREATE INDEX idx_user_follows_following
ON user_follows(following_id);



-- View
CREATE OR REPLACE VIEW post_trending AS
SELECT
  p.id AS post_id,
  p.user_id,
  p.content_text,
  p.created_at,

  -- Total Views
  COALESCE(COUNT(DISTINCT v.user_id), 0) AS views_count,

  -- Engagement
  COALESCE(COUNT(DISTINCT t.user_id), 0) AS trend_clicks,
  COALESCE(COUNT(DISTINCT l.user_id), 0) AS likes,
  COALESCE(COUNT(DISTINCT r.user_id), 0) AS reposts,
  COALESCE(COUNT(c.id), 0) AS comments_count,
  COALESCE(COUNT(DISTINCT c.user_id), 0) AS commenters_count,

  -- Weighted trend count
  COALESCE(
    COUNT(DISTINCT t.user_id) * 3 +
    COUNT(DISTINCT l.user_id) * 1 +
    COUNT(DISTINCT r.user_id) * 4 +
    COUNT(DISTINCT c.user_id) * 2,
  0) AS trend_count,

  -- Trend score
   -- Trend score with LN to smooth growth
  CASE
    WHEN COUNT(DISTINCT v.user_id) = 0 THEN 0
    ELSE (
      (COUNT(DISTINCT t.user_id) * 3 +
       COUNT(DISTINCT l.user_id) * 1 +
       COUNT(DISTINCT r.user_id) * 4 +
       COUNT(DISTINCT c.user_id) * 2)::FLOAT
      / LN(COUNT(DISTINCT v.user_id) + 1)
    )
  END AS trend_score

FROM posts p
LEFT JOIN posts_views   v ON v.post_id = p.id
LEFT JOIN posts_trend   t ON t.post_id = p.id
LEFT JOIN posts_repost  r ON r.post_id = p.id
LEFT JOIN posts_likes   l ON l.post_id = p.id
LEFT JOIN posts_comments c ON c.post_id = p.id

WHERE p.status = 'active'

GROUP BY p.id;
