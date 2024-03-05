// users.js
// This file contains the code for the user functionality.

import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadUsers() {
  try {
    const data = fs.readFileSync(__dirname + "/../data/users.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading user credentials from JSON file: ${err}`);
    throw err;
  }
}

function saveUsers(usersData) {
  try {
    fs.writeFileSync(
      __dirname + "/../data/users.json",
      JSON.stringify(usersData, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error(`Error writing user credentials to JSON file: ${err}`);
    throw err;
  }
}

export function registerUser(
  usersData,
  email,
  password,
  username,
  avatar,
  timezone,
  language,
  theme
) {
  // Check if email and username are unique
  const existingEmail = usersData.find((user) => user.email === email);
  const existingUsername = usersData.find((user) => user.username === username);
  if (existingEmail || existingUsername) {
    throw new Error("Email or username already exists");
  }
  avatar = avatar || "profie-photo-default.svg";
  timezone = timezone || "UTC";
  language = language || "en";
  theme = theme || "default";
  // Add new user credentials
  usersData.push({
    email,
    password,
    username,
    avatar,
    timezone,
    language,
    theme,
  });

  saveUsers(usersData);
}

// Update username, email and avatar
// POST settings/profile
// users.json is an array of user objects.
export function updateUserProfile(usersData, email, username, avatar) {
  const user = usersData.find((user) => user.email === email);
  if (user) {
    user.username = username;
    if (avatar !== "") {
      user.avatar = avatar;
    }
    saveUsers(usersData);
  }
}

// Update password
// POST settings/security
export function updateUserPassword(usersData, email, password) {
  const user = usersData.find((user) => user.email === email);
  if (user) {
    user.password = password;
    saveUsers(usersData);
  }
}

// Update region settings (currently only timezone)
// POST settings/region
export function updateUserRegion(usersData, email, timezone) {
  const user = usersData.find((user) => user.email === email);
  if (user) {
    user.timezone = timezone;
    saveUsers(usersData);
  }
}

// Update customizations (currently only language and theme)
// POST settings/customizations
export function updateUserCustomizations(usersData, email, language, theme) {
  const user = usersData.find((user) => user.email === email);
  if (user) {
    user.language = language;
    user.theme = theme;
    saveUsers(usersData);
  }
}
