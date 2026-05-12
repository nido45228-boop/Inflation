import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db', 'sqlite.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeTable();
    }
});

function initializeTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS air_tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER NOT NULL,
            destination TEXT NOT NULL,
            price TEXT NOT NULL
        )
    `;
    db.run(sql, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('air_tickets table is ready.');
            seedData();
        }
    });
}

function seedData() {
    db.get("SELECT COUNT(*) as count FROM air_tickets", (err, row) => {
        if (err) {
            console.error('Error checking table count:', err.message);
            return;
        }
        if (row.count === 0) {
            const tickets = [
                { year: 2021, destination: "日本 (東京/大阪)", price: "$25,000 - $40,000+" },
                { year: 2021, destination: "韓國 (首爾)", price: "$18,000 - $30,000" },
                { year: 2021, destination: "美國 (洛杉磯/舊金山)", price: "$60,000 - $120,000+" },
                { year: 2022, destination: "日本 (東京/大阪)", price: "$18,000 - $30,000" },
                { year: 2022, destination: "韓國 (首爾)", price: "$12,000 - $22,000" },
                { year: 2022, destination: "美國 (洛杉磯/舊金山)", price: "$50,000 - $90,000" },
                { year: 2023, destination: "日本 (東京/大阪)", price: "$15,000 - $25,000" },
                { year: 2023, destination: "韓國 (首爾)", price: "$10,000 - $18,000" },
                { year: 2023, destination: "美國 (洛杉磯/舊金山)", price: "$45,000 - $80,000" },
                { year: 2024, destination: "日本 (東京/大阪)", price: "$11,000 - $18,000" },
                { year: 2024, destination: "韓國 (首爾)", price: "$8,000 - $14,000" },
                { year: 2024, destination: "美國 (洛杉磯/舊金山)", price: "$38,000 - $65,000" },
                { year: 2025, destination: "日本 (東京/大阪)", price: "$9,000 - $16,000" },
                { year: 2025, destination: "韓國 (首爾)", price: "$7,000 - $12,000" },
                { year: 2025, destination: "美國 (洛杉磯/舊金山)", price: "$35,000 - $55,000" },
                { year: 2026, destination: "日本 (東京/大阪)", price: "$8,500 - $15,000" },
                { year: 2026, destination: "韓國 (首爾)", price: "$6,500 - $11,000" },
                { year: 2026, destination: "美國 (洛杉磯/舊金山)", price: "$32,000 - $50,000" }
            ];

            const stmt = db.prepare("INSERT INTO air_tickets (year, destination, price) VALUES (?, ?, ?)");
            tickets.forEach(ticket => {
                stmt.run(ticket.year, ticket.destination, ticket.price);
            });
            stmt.finalize();
            console.log('Seeded initial data into air_tickets table.');
        }
    });
}

export default db;