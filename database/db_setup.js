// db_setup.js

// Switch to the 'bhagavadgitaDB' database.
// If the database does not exist, MongoDB will create it upon the first data insertion.
use bhagavadgitaDB;

// --- Users Collection Setup ---

// 1. Create the 'users' collection.
// This command explicitly creates the collection. It's often optional as MongoDB
// creates collections implicitly when data is first inserted into them.
db.createCollection("users");

// 2. Create unique indexes for 'email' and 'username'.
// These indexes ensure that no two user documents can have the same email address
// or username, which is crucial for user authentication and identification.
// The '1' signifies an ascending index. Both 1 and -1 enforce uniqueness.

// Create a unique index on the 'email' field
db.users.createIndex({ "email": 1 }, { unique: true });

// Create a unique index on the 'username' field (highly recommended for public display names)
db.users.createIndex({ "username": 1 }, { unique: true });

// --- Example Data Insertion (Optional - for quick setup/testing) ---
// You can include a sample user document here for easy database population.
// REMINDER: In a real application, 'passwordHash' would be generated securely
// by your backend code (e.g., using bcrypt) during user registration.
// The 'ISODate' objects in the shell require 'new ISODate()'.

/*
db.users.insertOne({
  "email": "arjuna@example.com",
  "passwordHash": "$2b$12$f0Q0g9Yh7J5X9z2L1o3i4e5/U6P7v8W.9X0Y1Z2A3B4C5D6E7F8G9H0", // DUMMY HASH - REPLACE IN PROD
  "fullName": "Arjuna Pandava",
  "username": "arjuna_reads",
  "dateCreated": new ISODate("2025-09-05T10:00:00Z"),
  "lastLogin": new ISODate("2025-09-05T10:30:00Z"),
  "isActive": true,
  "roles": ["user"],
  "preferredLanguage": "english",
  "favoriteVerses": [
    { "chapter_number": 2, "verse_number": 47, "dateAdded": new ISODate("2025-09-05T11:00:00Z") },
    { "chapter_number": 18, "verse_number": 66, "dateAdded": new ISODate("2025-09-05T11:05:00Z") }
  ],
  "notesOnVerses": [
    {
      "chapter_number": 1,
      "verse_number": 1,
      "note": "Dhritarashtra's anxiety sets the moral conflict.",
      "dateCreated": new ISODate("2025-09-05T11:10:00Z"),
      "lastUpdated": new ISODate("2025-09-05T11:15:00Z")
    }
  ],
  "readProgress": {
    "lastChapterRead": 5,
    "lastVerseRead": 10,
    "lastReadDate": new ISODate("2025-09-05T11:20:00Z")
  },
  "passwordResetToken": null,
  "passwordResetExpires": null
});
*/

print("Database setup script executed.");
print("Ensure you have inserted your chapter data separately.");
print("Sample user insertion is commented out. Use your backend for secure user creation.");