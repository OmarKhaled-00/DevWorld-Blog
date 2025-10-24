import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { calculateReadTime, timeAgo } from "./helper.js";

// Convert import.meta.url to proper __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Now join path safely
const userProfilePath = path.join(__dirname, "../data/userProfile.json");

// Load JSON
const userProfile = JSON.parse(fs.readFileSync(userProfilePath, "utf-8"));

export function collectHomeData(currentUser) {
  // ---------------------------
  // All posts with author info
  // ---------------------------
  const allPosts = userProfile.flatMap((u) =>
    u.publishedArticles.map((article) => ({
      authorName: u.name,
      authorImage: u.image || "/images/no-image.jpg",
      title: article.title,
      summary: article.summary,
      category: article.category || "",
      image: article.articleImage || "",
      date: article.date || null,
      time: timeAgo(article.createdAt) || null,
      views: Number(article.views) || 0,
      likes: Number(article.likes) || 0,
      comments: article.comments || [], // keep comments for later
    }))
  );

  // ---------------------------
  // Unique tags (max 8)
  // ---------------------------
  const tagsList = [...new Set(allPosts.map((c) => c.category))].slice(0, 8);

  // ---------------------------
  // Recent comments (latest 3)
  // ---------------------------
  const recentComments = allPosts
    .flatMap((post) =>
      (post.comments || [])
        .filter((a) => a.authorUserName !== currentUser.username)
        .map((c) => {
          const commenter = userProfile.find(
            (u) => u.username === c.authorUserName
          );
          return {
            authorName: c.authorName,
            authorImage: commenter ? commenter.image : "/images/no-image.jpg",
            text: c.text,
            time: timeAgo(c.commentDate),
            alt: c.authorName,
            postTitle: post.title,
            postTag: post.category,
          };
        })
    )
    .slice(-3)
    .reverse();

  // ---------------------------
  // Featured Authors
  // ---------------------------
  const featuredAuthors = userProfile
    .filter((p) => p.username !== currentUser.username)
    .map((u) => ({
      name: u.name,
      role: u.role || "Author",
      image: u.image || "/images/no-image.jpg",
      articles: (u.publishedArticles || []).length,
      followers: Array.isArray(u.followers) ? u.followers.length : 0,
    }));

  // ---------------------------
  // Trend Post: highest likes + views
  // ---------------------------
  const trendPost =
    allPosts.length > 0
      ? allPosts.reduce((max, post) => {
          const postScore =
            (Number(post.likes) || 0) + (Number(post.views) || 0);
          const maxScore = (Number(max.likes) || 0) + (Number(max.likes) || 0);
          return postScore > maxScore ? post : max;
        }, allPosts[0])
      : null;

  //   const trendPost = allPosts.reduce((max, post) => {
  //     const postScore = (Number(post.likes) || 0) + (Number(post.views) || 0);
  //     const maxScore = (Number(max.likes) || 0) + (Number(max.likes) || 0);
  //     return postScore > maxScore ? post : max;
  //   }, allPosts[0] || null);
  // Remove trendPost from posts
  const postsWithoutTrend = allPosts.filter((p) => p !== trendPost);

  return {
    allPosts: postsWithoutTrend,
    tagsList,
    recentComments,
    featuredAuthors,
    trendPost,
  };
}
