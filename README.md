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

Make sure you have Node.js and npm installed on your machine.
*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/GitaMind.git
    ```
2.  Navigate to the project directory
    ```sh
    cd GitaMind
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
5.  Create a `.env` file in the `server` directory and add your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`).

### Running the Application

1.  Start the backend server (from the `/server` directory)
    ```sh
    npm run dev
    ```
2.  Start the frontend React app (from the `/client` directory)
    ```sh
    npm start
    ```
3.  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
