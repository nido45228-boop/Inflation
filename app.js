import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sqlite3 from 'sqlite3';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db', 'sqlite.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database in app.js:', err.message);
  } else {
    console.log('Connected to the SQLite database in app.js.');
  }
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// API Routes
app.get('/api/tickets', (req, res) => {
  const sql = 'SELECT * FROM air_tickets';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.get('/api/search', (req, res) => {
  const destination = req.query.destination;
  const sql = 'SELECT * FROM air_tickets WHERE destination = ?';
  db.all(sql, [destination], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.get('/api/insert', (req, res) => {
  const { year, destination, price } = req.query;
  if (!year || !destination || !price) {
    res.status(400).json({ "error": "Missing year, destination, or price" });
    return;
  }
  const sql = 'INSERT INTO air_tickets (year, destination, price) VALUES (?, ?, ?)';
  const params = [year, destination, price];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": { id: this.lastID, year, destination, price }
    });
  });
});

export default app;
