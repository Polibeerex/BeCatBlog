# BeCatBlog

BeCatBlog is a personal blog project aimed at practicing Express.js and EJS. The project allows users to register, log in, create, edit, and delete blog posts, as well as customize their profile settings.

## Features

- **User Authentication**: Users can register and log in to their accounts securely.
- **Create, Read, Update, Delete (CRUD) Posts**: Users can create new posts, view all posts, edit their own posts, and delete posts.
- **Image Upload**: Users can upload images for their blog posts.
- **User Profile Customization**: Users can customize their profile settings, including avatar, password, and region.
- **Reporting Posts**: Users can report inappropriate posts.

## Technologies Used

- **Express.js**: Used as the web application framework for Node.js.
- **EJS**: Embedded JavaScript templates for rendering HTML pages.
- **Multer**: Middleware for handling multipart/form-data, used for file uploads.
- **Express-session**: Session middleware for managing user sessions.
- **Body-parser**: Middleware for parsing incoming request bodies.
- **File System (fs)**: Used for file operations such as reading and writing JSON files.

## Getting Started

To get started with BeCatBlog, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the server using `npm start`.
4. Access the application at `http://localhost:3000`.

## File Structure

- **app/**
  - **blog.js**: Contains functions for managing blog posts.
  - **users.js**: Contains functions for managing user accounts.
- **data/**
  - **posts.json**: JSON file storing blog post data.
  - **users.json**: JSON file storing user account data.
- **public/**
  - **uploads/**
    - **avatars/**: Directory for storing user avatars.
    - **post-images/**: Directory for storing post images.
  - **pages/**
    - **404.html**: Custom 404 error page.
    - **policy.html**: Page for displaying UGC policy.
- **views/**: Contains EJS templates for rendering HTML pages.

## Usage

- `/`: Home page displaying all blog posts.
- `/login`: Login page for existing users.
- `/register`: Registration page for new users.
- `/logout`: Logout functionality.
- `/post`: Page for creating new blog posts.
- `/edit/:id`: Page for editing existing blog posts.
- `/delete/:id`: Endpoint for deleting blog posts.
- `/report/:id`: Endpoint for reporting inappropriate posts.
- `/settings`: User settings page for profile customization.
- `/policy`: UGC policy page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
