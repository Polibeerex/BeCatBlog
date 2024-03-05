import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import multer from "multer";
import {
  allPosts,
  newPost,
  editPost,
  deletePost,
  reportPost,
} from "./app/blog.js";
import {
  loadUsers,
  registerUser,
  updateUserProfile,
  updateUserPassword,
  updateUserRegion,
  updateUserCustomizations,
} from "./app/users.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const postImagesDir = "./public/uploads/post-images";
if (!fs.existsSync(postImagesDir)) {
  fs.mkdirSync(postImagesDir, { recursive: true });
}

const avatarImagesDir = "./public/uploads/avatars";
if (!fs.existsSync(avatarImagesDir)) {
  fs.mkdirSync(avatarImagesDir, { recursive: true });
}

let usersData = [];
let currentUserData = {};
let testUser = { email: "cat@becatblog.cat", password: "cat", username: "Cat" };

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/uploads/post-images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      currentUserData.username + Date.now() + path.extname(file.originalname)
    ); // Appending extension
  },
});
const uploadPost = multer({ storage: postStorage });

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/uploads/avatars"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      currentUserData.username + Date.now() + path.extname(file.originalname)
    ); // Appending extension
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

const app = express();
const port = 3000;

// 404 middleware

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note: In production, set secure to true to ensure the cookie is only sent over HTTPS.
  })
);

// Load user credentials from JSON file
try {
  const data = fs.readFileSync("./data/users.json", "utf8");
  usersData = JSON.parse(data);
  console.log(usersData);
} catch (err) {
  console.error(`Error reading user credentials from JSON file: ${err}`);
}

// If user is unauthorized, redirect to login page
// If user is authorized, redirect to home page
app.get("/", checkAuth, (req, res) => {
  res.render("home.ejs", {
    posts: allPosts(),
    username: currentUserData.username,
    avatar: currentUserData.avatar,
  });
  console.log("User authorized. Rendering home page");
});

app.get("/login", (req, res) => {
  if (req.session.userAuthorized) {
    res.redirect("/");
    console.log("User authorized. Redirecting to home page");
  } else {
    res.render("login.ejs");
    console.log("Login Page");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
    console.log("Email and password are required");
  } else {
    try {
      const user = usersData.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        req.session.userAuthorized = true;
        currentUserData = user;
        console.log(currentUserData);
        res.redirect("/");
        console.log("User authorized. Redirecting to home page");
      } else {
        res.send("Invalid credentials");
        console.log("Invalid credentials");
      }
    } catch (err) {
      console.error(`Error reading user credentials from JSON file: ${err}`);
      res.status(500).send("Internal Server Error");
    }
  }
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
  console.log("Register Page");
});

app.post("/register", (req, res) => {
  const { email, password, username } = req.body;
  if (!req.body.email || !req.body.password || !req.body.username) {
    res.status(400).send("Email, password, and username are required");
    console.log("Email, password, and username are required");
  } else {
    // Load user credentials from JSON file
    let usersData;
    try {
      usersData = loadUsers();
      console.log(usersData);
    } catch (err) {
      console.error(`Error reading user credentials from JSON file: ${err}`);
      res.status(500).send("Internal Server Error");
      return;
    }

    try {
      registerUser(usersData, email, password, username);
      res.redirect("/");
      console.log("User registered successfully");
    } catch (err) {
      console.error(err.message);
      res.status(409).send(err.message);
    }
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/login");
      console.log("User logged out. Redirecting to login page");
    }
  });
});

// Create a new post
app.get("/post", checkAuth, (req, res) => {
  res.render("post.ejs", {
    username: currentUserData.username,
    avatar: currentUserData.avatar,
  });
  console.log("User authorized. Rendering post page");
});

app.post("/post", checkAuth, uploadPost.single("image"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  const { title, content } = req.body;
  let image; // Initialize image

  if (!title || !content) {
    res.status(400).send("Title and content are required");
    console.log("Title and content are required");
    console.log(req.body);
  } else {
    if (!req.file) {
      image = "post-image-default.jpg";
    } else {
      // If an image was uploaded, update the image path
      image = req.file.filename; // Use req.file.filename to get the uploaded file's name
    }
    newPost(
      title,
      content,
      currentUserData.username,
      image,
      currentUserData.avatar
    );
    res.redirect("/");
    console.log("Post created successfully");
  }
});

// edit post by id
app.get("/edit/:id", checkAuth, (req, res) => {
  // check if the post exists
  const postId = req.params.id;
  const post = allPosts().find((post) => post.id == postId);
  if (!post) {
    res.status(404).send("Post not found");
    console.log("Post not found");
  } else if (post.username !== currentUserData.username) {
    res.status(403).send("You are not authorized to edit this post");
    console.log("User not authorized to edit this post");
  } else {
    res.render("edit.ejs", {
      post,
      username: currentUserData.username,
      avatar: currentUserData.avatar,
    });
    console.log("User authorized. Rendering edit page");
  }
});

app.post("/edit/:id", checkAuth, uploadPost.single("image"), (req, res) => {
  const postId = req.params.id;
  const post = allPosts().find((post) => post.id == postId);
  if (!post) {
    res.status(404).send("Post not found");
    console.log("Post not found");
  } else if (post.username !== currentUserData.username) {
    res.status(403).send("You are not authorized to edit this post");
    console.log("User not authorized to edit this post");
  } else {
    const { title, content } = req.body;
    let image; // Initialize image

    if (!title || !content) {
      res.status(400).send("Title and content are required");
      console.log("Title and content are required");
    } else {
      if (req.file) {
        // If an image was uploaded, update the image path
        image = req.file.filename; // Use req.file.filename to get the uploaded file's name
      }
      editPost(postId, title, content, image);
      res.redirect("/");
      console.log("Post edited successfully");
    }
  }
});

app.get("/delete/:id", checkAuth, (req, res) => {
  const postId = req.params.id;
  const post = allPosts().find((post) => post.id == postId);
  if (!post) {
    res.status(404).send("Post not found");
    console.log("Post not found");
  } else if (post.username !== currentUserData.username) {
    res.status(403).send("You are not authorized to delete this post");
    console.log("User not authorized to delete this post");
  } else {
    deletePost(postId);
    res.redirect("/");
    console.log("Post deleted successfully");
  }
});

app.get("/report/:id", checkAuth, (req, res) => {
  res.redirect("/");
});

app.post("/report/:id", checkAuth, (req, res) => {
  res.redirect("/");
});

app.get("/settings", checkAuth, (req, res) => {
  res.render("settings.ejs", {
    username: currentUserData.username,
    email: currentUserData.email,
    avatar: currentUserData.avatar,
    password: currentUserData.password,
    country: currentUserData.country,
    city: currentUserData.city,
    timezone: currentUserData.timezone,
  });
  console.log("User authorized. Rendering settings page");
});

app.post(
  "/settings/profile",
  checkAuth,
  uploadAvatar.single("avatar"),
  (req, res) => {
    if (isTestUser()) {
      res.status(403).send("Testing user cannot change profile");
      console.log("Testing user cannot change profile");
    } else {
      let avatarImage; // Initialize avatar
      if (!req.file) {
        avatarImage = "profile-photo-default.svg"; // Use a default avatar image if no file was uploaded
      } else {
        // If an image was uploaded, update the avatar path
        avatarImage = req.file.filename; // Use req.file.filename to get the uploaded file's name
      }
      const { email, username } = req.body;
      updateUserProfile(usersData, email, username, avatarImage);
    }
  }
);

app.post("/settings/security", checkAuth, (req, res) => {
  if (isTestUser()) {
    res.status(403).send("Testing user cannot change password");
    console.log("Testing user cannot change password");
  } else {
    const {
      "current-password": currentPassword,
      "new-password": newPassword,
      "confirm-password": confirmPassword,
    } = req.body;
    if (newPassword !== confirmPassword) {
      res.status(400).send("New password and confirm password do not match");
      console.log("New password and confirm password do not match");
    } else {
      updateUserPassword(usersData, currentUserData.email, newPassword);
    }
    res.redirect("/settings");
  }
});

app.post("/settings/region", checkAuth, (req, res) => {
  const { email, timezone } = req.body;
  updateUserRegion(usersData, email, timezone);
  res.redirect("/settings");
});

app.post("/settings/customization", checkAuth, (req, res) => {
  const { email, language, theme } = req.body;
  updateUserCustomizations(usersData, email, language, theme);
  res.redirect("/settings");
});

app.get("/policy", (req, res) => {
  res.sendFile(__dirname + "/public/pages/policy.html");
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.use((req, res, next) => {
  res
    .status(404)
    .type("html")
    .sendFile(__dirname + "/public/pages/404.html");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function checkAuth(req, res, next) {
  if (req.session.userAuthorized) {
    next();
  } else {
    res.redirect("/login");
    console.log("User unauthorized. Redirecting to login page");
  }
}

//check if user is a guest
function isTestUser() {
  if (currentUserData.email === testUser.email) {
    return true;
  }
  return false;
}
