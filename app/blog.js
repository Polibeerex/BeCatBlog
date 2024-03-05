// blog.js
// This file contains the code for the blog functionality.
export { newPost, allPosts, editPost, deletePost, reportPost };

import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const postsFilePath = __dirname + "/../data/posts.json";

// Load posts from the JSON file
let posts = loadPosts();

// Create a new post
function newPost(title, content, username, image, userAvatar) {
  const date = new Date();
  // Generate a unique id that is one larger than the current largest id
  const ids = posts.map((post) => post.id);
  const id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  const post = { id, title, content, username, date, image, userAvatar };
  posts.push(post);
  savePosts();
  console.log("New post created");
}

// Get all posts
function allPosts() {
  console.log("All posts retrieved");
  // sort posts by date
  let sortedPosts = [...posts].sort((a, b) => b.date - a.date);
  // convert date to string for display
  let displayPosts = sortedPosts.map((post) => {
    return {
      ...post,
      date: post.date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }),
    };
  });
  return displayPosts;
}

// Edit post by id
function editPost(postId, title, content, image) {
  // Find the post in the allPosts array
  const post = posts.find((post) => post.id == postId);

  // Update the post's title, content, and image
  post.title = title;
  post.content = content;

  if (image) {
    post.image = image;
  }
  savePosts();
  console.log("Post edited");
}

// Load posts from the JSON file
function loadPosts() {
  try {
    const data = fs.readFileSync(postsFilePath, "utf8");
    const posts = JSON.parse(data);
    // Convert date strings back to Date objects
    posts.forEach((post) => {
      post.date = new Date(post.date);
    });
    return posts;
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}
// Save posts to the JSON file
function savePosts() {
  try {
    const data = JSON.stringify(posts, null, 2);
    fs.writeFileSync(postsFilePath, data, "utf8");
  } catch (error) {
    console.error("Error saving posts:", error);
  }
}

// Delete post by id
function deletePost(postId) {
  posts = posts.filter((post) => post.id != postId);
  savePosts();
  console.log("Post deleted");
}

// Report post by id and save the report to the JSON file
function reportPost(postId, reason) {
  const post = posts.find((post) => post.id == postId);
  post.reports.push(reason);
  savePosts();
  console.log("Post reported");
}
