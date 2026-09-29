const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
// This creates 'database.sqlite' in the backend folder if it doesn't exist
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create the users table if it is the first time running
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT UNIQUE,
            email TEXT UNIQUE,
            name TEXT,
            photoUrl TEXT,
            role TEXT DEFAULT 'trainee',
            last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// -----------------------------------------------------
// ROUTE: Google Authentication Sync
// -----------------------------------------------------
// This route is called by the React frontend AFTER Firebase logs the user in.
// It checks if the user exists in SQLite. If yes, it logs them in. If no, it creates a new record.
app.post('/api/auth/google', (req, res) => {
    const { uid, email, name, photoUrl, role } = req.body;

    if (!uid || !email) {
        return res.status(400).json({ error: 'Missing required Firebase user data' });
    }

    // 1. Check if user already exists in SQLite
    db.get(`SELECT * FROM users WHERE firebase_uid = ?`, [uid], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (row) {
            // User exists: Update their last login time
            db.run(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE firebase_uid = ?`, [uid]);
            console.log(`Existing user logged in: ${email}`);
            return res.json({ message: 'User authenticated successfully', user: row });
        } else {
            // User does not exist: Create a new record in SQLite
            const userRole = role || 'trainee'; // Default to trainee if not specified
            const insertQuery = `INSERT INTO users (firebase_uid, email, name, photoUrl, role) VALUES (?, ?, ?, ?, ?)`;
            
            db.run(insertQuery, [uid, email, name, photoUrl, userRole], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create user in database: ' + err.message });
                }
                
                console.log(`New user created: ${email}`);
                res.status(201).json({ 
                    message: 'New user created successfully', 
                    user: { 
                        id: this.lastID, 
                        firebase_uid: uid, 
                        email, 
                        name, 
                        role: userRole 
                    } 
                });
            });
        }
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
