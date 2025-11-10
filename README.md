# GitaMind 🕉️

GitaMind is a modern web application designed to bring the timeless wisdom of the Bhagavad Gita to users in an accessible, personal, and engaging way. This project leverages the MERN stack to create a feature-rich platform for daily inspiration and learning.

**[Live Demo Link Here]** <!-- Add your deployed link when ready -->

## ✨ Key Features

This application is built with a focus on user interaction and content discovery, providing multiple ways to explore the Gita's wisdom.

*   🔐 **User Authentication:** Securely sign up, log in, and log out to access a personalized experience. All your favorites, notes, and progress are saved to your account.

*   🔍 **Powerful Search:** Instantly find specific verses or themes by searching with keywords like "duty," "peace," or "soul."

*   🧘 **Mood-Based Exploration:** Select your current mood (e.g., Motivated, Stressed, Confused) to receive a curated list of verses that offer guidance and comfort.

*   🎧 **Audio Recitations:** Listen to each verse with a single click. The audio feature offers an immersive way to experience the content, catering to auditory learners.

*   ❤️ **Personal Favorites:** Bookmark any verse that resonates with you. All your saved verses are collected in a dedicated "Favorites" section for easy access.

*   🔥 **Daily Visit Streak:** Stay motivated with a streak tracker that counts your consecutive daily visits, encouraging a consistent learning habit.

*   📖 **Simple Explanations:** Go beyond the original text. A button reveals a short, clear explanation for each verse, making the ancient teachings accessible to a modern audience.

*   🎨 **Dark/Light Mode:** Switch between a light or dark theme for comfortable reading in any environment. The app remembers your preference.

*   🔗 **Related Verses:** Discover interconnected concepts within the Gita. The app automatically suggests verses with similar themes, encouraging deeper exploration.

*   📲 **Share a Verse:** Easily share your favorite verses with friends and family via social media or messaging apps with a simple share button.

*   ✍️ **Simple Personal Notes:** Add your own private reflections and insights to your saved verses. This simple journaling feature helps you document your spiritual journey.

## 🛠️ Technology Stack

This project is built using the MERN stack, demonstrating a full-stack web development approach.

*   **Frontend:** React.js
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB
*   **Authentication:** JWT (JSON Web Tokens)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
*   **Node.js** (v14 or higher)
*   **npm** (comes with Node.js)
*   **MongoDB** (local installation or MongoDB Atlas account)

*   Install the latest npm:
    ```sh
    npm install npm@latest -g
    ```

### Database Setup

You have two options for the database:

**Option 1: Local MongoDB**
1. Install MongoDB locally on your machine
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/gitamind`

**Option 2: MongoDB Atlas (Recommended)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string from Atlas
4. Use the Atlas connection string in your `.env` file

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/nemishsapara69/GitaMind-Your-Daily-Dose-of-Wisdom.git
    ```
2.  Navigate to the project directory
    ```sh
    cd GitaMind-Your-Daily-Dose-of-Wisdom
    ```
3.  Install server dependencies
    ```sh
    cd server
    npm install
    ```
4.  Install client dependencies
    ```sh
    cd ../client
    npm install
    ```
5.  Create a `.env` file in the `server` directory and add your environment variables:
    ```sh
    cd server
    cp .env.example .env
    ```
    Then edit the `.env` file with your actual values:
    - `MONGO_URI`: Your MongoDB connection string
    - `JWT_SECRET`: A secure random string for JWT token signing
    - `PORT`: Server port (default: 5000)

### Running the Application

1.  Start the backend server (from the `/server` directory)
    ```sh
    cd server
    npm run dev
    ```
2.  Start the frontend React app (from the `/client` directory)
    ```sh
    cd ../client
    npm run dev
    ```
3.  Open [http://localhost:5173](http://localhost:5173) to view it in the browser (Vite default port).

## 🚀 Quick Start Guide

After cloning the repository, follow these steps:

```sh
# Navigate to project directory
cd GitaMind-Your-Daily-Dose-of-Wisdom

# Install server dependencies
cd server
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your database URL and JWT secret

# Install client dependencies
cd ../client
npm install

# Start the application
# Terminal 1: Start server (from server directory)
cd server
npm run dev

# Terminal 2: Start client (from client directory) 
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Environment Variables

Create a `.env` file in the server directory with these variables:

```env
MONGO_URI=mongodb://localhost:27017/gitamind
JWT_SECRET=your_very_secure_jwt_secret_here
PORT=5000
NODE_ENV=development
```

## 📝 Notes for Contributors

- The backend server runs on port 5000 by default
- The frontend development server (Vite) runs on port 5173
- Make sure MongoDB is running before starting the backend
- Use `npm run dev` for development (with hot reload)
- Use `npm start` for production
