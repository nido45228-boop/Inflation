import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sqlite3 from 'sqlite3';
import axios from 'axios';
import * as cheerio from 'cheerio';

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

app.get('/api/scrape', async (req, res) => {
    try {
        // 1. 獲取使用者輸入的網址
        const targetUrl = req.query.url;
        if (!targetUrl) {
            return res.status(400).json({ error: "請提供要爬取的網址 (url 參數)。" });
        }

        console.log(`正在爬取: ${targetUrl}`);

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 設定 10 秒逾時
        });
        const $ = cheerio.load(response.data);

        // 2. 解析網頁 (通用邏輯嘗試)
        const priceData = [];
        
        // 針對特定知名網站的特殊處理 (如果有的話)
        if (targetUrl.includes('foodchina.com.tw')) {
            $('table#ctl00_ctl00_cpl_MainContent_cpl_BasicMainContent_ctl00_T_54_51 tbody tr').each((index, element) => {
                const rowPrices = $(element).find('td.bodytext4 span').map((_, el) => $(el).text()).get();
                if (rowPrices.length > 0) {
                    const cleanedPrice = rowPrices[0].replace(/[^0-9.-]/g, '');
                    if(cleanedPrice) priceData.push(cleanedPrice);
                }
            });
        } else {
            // 通用嘗試：尋找包含「$」或「價格」字樣附近的數字，或常見的價格 class
            // 這裡簡單嘗試抓取所有可能是數字的文字
            $('.price, .trip-price, .amount, span:contains("$")').each((index, element) => {
                const text = $(element).text();
                const cleanedPrice = text.replace(/[^0-9.-]/g, '');
                if (cleanedPrice && !isNaN(cleanedPrice)) {
                    priceData.push(cleanedPrice);
                }
            });
        }

        if (priceData.length === 0) {
            return res.status(404).json({ 
                message: "在該網址中找不到可辨識的價格資料。請確保網址是靜態 HTML 頁面。",
                url: targetUrl
            });
        }

        // 去重並限制筆數以免爆掉
        const uniquePrices = [...new Set(priceData)].slice(0, 10);

        // 3. 將爬到的資料存入 SQLite
        const currentYear = new Date().getFullYear();
        const domain = new URL(targetUrl).hostname;
        
        const stmt = db.prepare("INSERT INTO air_tickets (year, destination, price) VALUES (?, ?, ?)");
        uniquePrices.forEach(price => {
            stmt.run(currentYear, `爬取自: ${domain}`, price);
        });
        stmt.finalize();

        res.json({ 
            message: `成功從 ${domain} 爬取並新增 ${uniquePrices.length} 筆資料！`,
            prices: uniquePrices
        });

    } catch (error) {
        console.error("爬蟲執行錯誤:", error.message);
        res.status(500).json({ error: "爬蟲執行失敗", details: error.message });
    }
});

export default app;
