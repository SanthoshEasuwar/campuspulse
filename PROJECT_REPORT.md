# CampusPulse Project Report

## 1. Project Overview

CampusPulse is a full-stack campus social networking web application. It allows students to register, log in, create posts, interact with campus updates, follow other users, post anonymous confessions, view campus events, and use admin moderation tools.

The project is divided into two main parts:

- `backend`: Express.js server with MongoDB database integration.
- `campuspulse`: React frontend built with Vite.

The application is designed around student community interaction. It includes authentication, user profiles, posts, comments, reactions, follow requests, anonymous confessions, event-style campus features, leaderboards, and an admin dashboard.

## 2. Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS-in-JS style block inside `App.jsx`
- Fetch API for backend communication

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- Passport Local Strategy
- Cookie-based authentication
- Joi validation
- bcryptjs password hashing

## 3. Folder Structure

The project contains the following important files and folders:

```text
NAU/
  backend/
    server.js
    package.json
    controllers/
      authController.js
      userController.js
    middleware/
      authMiddleware.js
      passportConfig.js
    models/
      user.js
      post.js
      confession.js
    routes/
      authRoutes.js
      userRoutes.js
      postRoutes.js
      confessionRoutes.js
    validators/
      authValidator.js

  campuspulse/
    package.json
    vite.config.js
    index.html
    public/
      favicon.svg
      icons.svg
    src/
      App.jsx
      main.jsx
      assets/
        hero.png
        react.svg
        vite.svg
```

The `node_modules` folders are installed dependency folders and should not be included in the main project explanation. The `campuspulse/dist` folder is a generated production build and is also not normally explained as source code.

## 4. Backend Description

The backend is located in the `backend` folder. It uses Express.js to create REST API routes and MongoDB Atlas as the database.

### 4.1 Server Entry Point

Main file:

```text
backend/server.js
```

Responsibilities:

- Creates the Express application.
- Enables CORS.
- Parses JSON request bodies.
- Parses cookies using `cookie-parser`.
- Initializes Passport authentication.
- Connects to MongoDB using Mongoose.
- Registers API routes.
- Starts the server on port `5000`.

The backend exposes these route groups:

```text
/api/auth
/api/users
/api/posts
/api/confessions
```

It also has a root route:

```text
GET /
```

This returns:

```text
Backend working
```

### 4.2 Database Connection

The project connects to MongoDB Atlas using Mongoose. The current connection string is directly written in `server.js`.

For a real production system, the connection string should be stored in an environment variable instead of being hardcoded.

Recommended environment variable:

```text
MONGO_URI=mongodb+srv://...
```

### 4.3 Admin User Creation

The backend contains an `ensureAdminUser` function. This function checks whether an admin user exists. If no admin user is found, it creates a default admin account.

Default admin values:

```text
Email: admin@vitstudent.ac.in
Password: Admin@123
Name: Campus Admin
Role: admin
Status: active
```

These values can be changed using environment variables:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_NAME
```

## 5. Backend Modules

### 5.1 Authentication Controller

File:

```text
backend/controllers/authController.js
```

Main functions:

- `signup`
- `login`
- `logout`

The signup process:

- Validates the request body using Joi.
- Checks whether the email is already registered.
- Creates a new user.
- Hashes the password through the user model pre-save hook.
- Generates a JWT token.
- Stores the token in an HTTP-only cookie.
- Returns user profile data.

The login process:

- Validates login data using Joi.
- Uses Passport Local Strategy.
- Checks email and password.
- Blocks users with `restricted` status.
- Generates a JWT token.
- Stores the token in an HTTP-only cookie.

The logout process:

- Clears the JWT cookie.
- Returns a logout success message.

### 5.2 User Controller

File:

```text
backend/controllers/userController.js
```

Main features:

- Get current user profile.
- Get another user profile.
- Update profile bio and profile picture.
- List all users.
- Send follow requests.
- Accept follow requests.
- Decline follow requests.
- Unfollow users.
- View followers.
- View following users.
- Admin user management.
- Admin role updates.
- Admin account restriction.
- Admin points adjustment.

The controller also sanitizes user data before sending it to the frontend. Sensitive information such as passwords is removed.

### 5.3 Authentication Middleware

File:

```text
backend/middleware/authMiddleware.js
```

Main middleware:

- `protect`
- `requireAdmin`
- `requireActive`

`protect` verifies the JWT token from either:

- Cookie: `jwt`
- Authorization header: `Bearer <token>`

`requireAdmin` allows only admin users to access selected routes.

`requireActive` blocks restricted users from performing actions such as posting, following, commenting, or liking.

### 5.4 Passport Configuration

File:

```text
backend/middleware/passportConfig.js
```

This file configures Passport Local Strategy. It uses the email field as the username and verifies the password using the `matchPassword` method from the user model.

### 5.5 Validation

File:

```text
backend/validators/authValidator.js
```

The project uses Joi to validate signup and login data.

Important validation rule:

```text
Only @vitstudent.ac.in email accounts are allowed.
```

This ensures that only VIT student email addresses can register and log in.

## 6. Database Models

### 6.1 User Model

File:

```text
backend/models/user.js
```

Fields:

- `name`
- `email`
- `password`
- `role`
- `status`
- `adminNotes`
- `pointsAdjustment`
- `bio`
- `profilePicture`
- `followers`
- `following`
- `pendingRequests`
- `activities`

Important features:

- Passwords are hashed using bcrypt before saving.
- A `matchPassword` method compares entered passwords with hashed passwords.
- The password field is removed before converting user data to JSON.
- A virtual `id` field is created from MongoDB `_id`.

### 6.2 Post Model

File:

```text
backend/models/post.js
```

Fields:

- `userId`
- `title`
- `body`
- `eventDate`
- `eventTime`
- `tag`
- `mood`
- `location`
- `mapX`
- `mapY`
- `ts`
- `likes`
- `reactions`
- `comments`

The post model supports:

- Campus posts
- Event information
- Likes
- Emoji reactions
- Comments
- Location/map data

### 6.3 Confession Model

File:

```text
backend/models/confession.js
```

Fields:

- `text`
- `tag`
- `likes`
- `createdBy`
- `ts`

Confessions are stored with a creator ID in the database, but the frontend presents them as anonymous posts.

## 7. API Endpoints

### 7.1 Authentication Routes

File:

```text
backend/routes/authRoutes.js
```

Endpoints:

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
```

### 7.2 User Routes

File:

```text
backend/routes/userRoutes.js
```

Endpoints:

```text
GET    /api/users/me
PUT    /api/users/me
GET    /api/users
GET    /api/users/requests
GET    /api/users/:id
POST   /api/users/:id/follow
POST   /api/users/:id/unfollow
POST   /api/users/:id/accept
POST   /api/users/:id/decline
GET    /api/users/:id/followers
GET    /api/users/:id/following
GET    /api/users/admin/users
PATCH  /api/users/admin/:id/status
PATCH  /api/users/admin/:id/role
PATCH  /api/users/admin/:id/points
```

Admin endpoints are protected by `requireAdmin`.

### 7.3 Post Routes

File:

```text
backend/routes/postRoutes.js
```

Endpoints:

```text
POST   /api/posts
GET    /api/posts
GET    /api/posts/user/:id
POST   /api/posts/:id/like
POST   /api/posts/:id/react
POST   /api/posts/:id/comment
DELETE /api/posts/:id
```

Users must be authenticated to access post routes. Creating, liking, reacting, commenting, and deleting require the user account to be active.

### 7.4 Confession Routes

File:

```text
backend/routes/confessionRoutes.js
```

Endpoints:

```text
GET  /api/confessions
POST /api/confessions
POST /api/confessions/:id/like
```

Confession routes require authentication. Posting and liking require active account status.

## 8. Frontend Description

The frontend is located in:

```text
campuspulse
```

It is a React application created with Vite.

Main files:

```text
campuspulse/src/main.jsx
campuspulse/src/App.jsx
```

### 8.1 Frontend Entry Point

File:

```text
campuspulse/src/main.jsx
```

This file renders the main React `App` component into the HTML root element.

### 8.2 Main Application Component

File:

```text
campuspulse/src/App.jsx
```

This is the main frontend file. It contains:

- Application state.
- Authentication UI.
- Dashboard layout.
- Post creation.
- Post feed.
- Comments.
- Likes.
- Reactions.
- Confessions.
- Profile page.
- Follow system.
- Notification display.
- Admin dashboard.
- Campus map UI.
- Event/calendar UI.
- NAUBOT helper UI.
- Dark and light theme styling.

The frontend connects to the backend using:

```text
http://localhost:5000/api
```

The API helper is:

```text
const API = "http://localhost:5000/api";
const apiFetch = (path, opts = {}) => fetch(`${API}${path}`, { credentials: "include", ...opts });
```

The `credentials: "include"` option is important because the backend stores JWT authentication in cookies.

## 9. Main Features

### 9.1 User Authentication

Users can:

- Sign up with a valid VIT student email.
- Log in using email and password.
- Stay authenticated through a JWT cookie.
- Log out.

### 9.2 Posts

Users can:

- Create campus posts.
- Add title, body, tag, mood, location, date, and time.
- Like posts.
- React with emojis.
- Comment on posts.
- Delete their own posts.

### 9.3 Profiles

Users can:

- View their own profile.
- View other users' profiles.
- Edit their bio.
- See profile statistics.
- See their own posts.

### 9.4 Follow System

Users can:

- Send follow requests.
- Accept follow requests.
- Decline follow requests.
- View followers.
- View following list.

### 9.5 Anonymous Confessions

Users can:

- Post anonymous confessions.
- View confession feed.
- Like confessions.

### 9.6 Admin Dashboard

Admin users can:

- View all users.
- Search/filter users.
- Restrict or reactivate accounts.
- Promote users to admin.
- Remove admin role from other admins.
- Adjust leaderboard points.
- View user activity statistics.

### 9.7 Campus Events and Map

The frontend includes UI sections for:

- Campus events.
- Calendar display.
- RSVP/reminder style interactions.
- Campus map pins.
- Trending topics.
- Mood analytics.

Some of these features are frontend-managed and use local state rather than database persistence.

### 9.8 NAUBOT

The app includes a small helper bot interface called NAUBOT. It helps users ask about dates and campus events. In the current version, this appears to work from frontend-defined event data rather than an external AI service.

## 10. How to Access All Project Files

Open PowerShell and go to the project root:

```powershell
cd "c:\Users\Santhosh Easuwar.S\NAU"
```

To list all useful project files while excluding `node_modules`:

```powershell
Get-ChildItem -Recurse -File | Where-Object {
  $_.FullName -notmatch "\\node_modules\\"
} | ForEach-Object {
  $_.FullName.Replace("c:\Users\Santhosh Easuwar.S\NAU\", "")
}
```

To save the file list:

```powershell
Get-ChildItem -Recurse -File | Where-Object {
  $_.FullName -notmatch "\\node_modules\\"
} | ForEach-Object {
  $_.FullName.Replace("c:\Users\Santhosh Easuwar.S\NAU\", "")
} > project-files.txt
```

To open the whole project in VS Code:

```powershell
code .
```

To open the backend server file:

```powershell
code backend/server.js
```

## 11. How to Run the Project

### 11.1 Run the Backend

Open a terminal:

```powershell
cd "c:\Users\Santhosh Easuwar.S\NAU\backend"
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 11.2 Run the Frontend

Open another terminal:

```powershell
cd "c:\Users\Santhosh Easuwar.S\NAU\campuspulse"
npm install
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## 12. Security Notes

The project includes several good security practices:

- Password hashing with bcrypt.
- JWT-based authentication.
- HTTP-only cookies.
- Protected API routes.
- Admin-only route protection.
- Email validation using Joi.
- Passwords removed from JSON responses.

Recommended improvements:

- Move MongoDB connection string to `.env`.
- Move JWT secret to `.env`.
- Avoid using default JWT secret in development or production.
- Add stricter CORS configuration instead of `origin: true`.
- Add rate limiting for login/signup routes.
- Add stronger password rules.
- Add input validation for post and confession routes.

## 13. Limitations

Current limitations:

- Frontend code is mostly concentrated in one large `App.jsx` file.
- Some frontend features appear to be local-state based rather than fully persisted.
- MongoDB connection string is hardcoded.
- There is no automated test suite except small backend test/helper files.
- `routes/user.js` appears to be an unused placeholder file.
- The production build folder `dist` is present in the frontend folder.

## 14. Future Enhancements

Possible improvements:

- Split `App.jsx` into smaller reusable components.
- Create separate API service files for frontend requests.
- Add environment variable support for backend configuration.
- Add frontend routing with React Router.
- Add full testing with Jest, Vitest, or React Testing Library.
- Add image upload for profile pictures and posts.
- Add real-time notifications using Socket.IO.
- Persist RSVP, reminders, and bot interactions in the database.
- Add pagination for posts and confessions.
- Add moderation tools for posts and confessions.

## 15. Conclusion

CampusPulse is a full-stack MERN-style campus social platform. The backend handles authentication, users, posts, confessions, follow relationships, and admin controls using Express and MongoDB. The frontend provides a modern React interface with feeds, profiles, events, confessions, admin tools, and campus-focused interactive features.

The project demonstrates important full-stack development concepts such as REST APIs, database modeling, authentication, protected routes, frontend state management, and user interaction features.
