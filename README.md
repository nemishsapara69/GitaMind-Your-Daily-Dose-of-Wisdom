# 🌿 GitaMind – Wisdom from the Bhagavad Gita

A MERN-stack web application that delivers **daily wisdom from the Bhagavad Gita**, tailored to your **mood, search preferences, or saved favorites**.  
Built with ❤️ using **MongoDB, Express.js, React.js, and Node.js**.

---

## ✨ Features

- 📖 **Verse of the Day** – Get inspired daily with a random verse.
- 😌 **Mood-Based Wisdom** – Select a mood (Happy, Stressed, Confused, Motivated, etc.) to receive relevant verses.
- 🔎 **Powerful Search** – Search verses by keywords like *duty, peace, devotion*.
- ⭐ **Personal Favorites** – Save verses that resonate with you for easy access later.
- ⚡ **Smooth Experience** – Powered by the **MERN stack**, with a responsive React frontend.

---

## 📸 Screenshots (Add Yours)

> Replace these with your actual app screenshots.

| Homepage | Mood Selection | Favorites |
|----------|----------------|-----------|
| ![Homepage](./screenshots/home.png) | ![Mood](./screenshots/mood.png) | ![Favorites](./screenshots/favorites.png) |

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Hooks, Axios, Context API)
- **Backend:** Node.js + Express.js (REST API)
- **Database:** MongoDB (with Mongoose ODM)
- **Others:** JSON Web Tokens (JWT), bcrypt, dotenv

---

## 🔄 Flowcharts

### 📌 User Journey Flow

```mermaid
graph TD
    A[Start: User Visits GitaMind Website] --> B{Homepage Loads};
    B --> C[Display "Verse of the Day"];
    B --> D[Show Options: <br/>1. Explore by Mood<br/>2. Search<br/>3. Favorites];

    D --> E{User clicks 'Explore by Mood'};
    E --> F[User Selects a Mood];
    F --> G[Display Related Verses];
    G --> H(User can read or favorite a verse);

    D --> I{User clicks 'Search'};
    I --> J[User Enters a Keyword];
    J --> K[Display All Verses Containing the Keyword];
    K --> H;

    D --> L{User clicks 'View Favorites'};
    L --> M[Display All Saved/Favorite Verses];
    M --> H;
