/**
 * Portfolio Server - Main Entry Point
 * Author: Laxman Chanshetty
 * Description: Express server for portfolio website
 */

'use strict';

// ─── Dependencies ────────────────────────────────────────────────────────────
const express    = require('express');
const path       = require('path');
const helmet     = require('helmet');
const morgan     = require('morgan');
const compression = require('compression');
require('dotenv').config();

// ─── Portfolio Data ───────────────────────────────────────────────────────────
const portfolioData = require('./data/portfolio.json');

// ─── App Initialization ───────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;
const ENV  = process.env.NODE_ENV || 'development';

// ─── View Engine ─────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ───────────────────────────────────────────────────────────────

// Compress all responses
app.use(compression());

// Security headers (relaxed CSP for inline styles/scripts in portfolio)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        scriptSrc:   ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc:     ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        imgSrc:      ["'self'", "data:", "https:"],
        connectSrc:  ["'self'"],
      },
    },
  })
);

// HTTP request logger (only in development)
if (ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: ENV === 'production' ? '1d' : 0, // Cache static assets in production
}));

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /
 * Renders the main portfolio page with all data
 */
app.get('/', (req, res) => {
  res.render('index', {
    data: portfolioData,
    currentYear: new Date().getFullYear(),
  });
});

/**
 * GET /skills
 * Serves the advanced skills section page
 */
app.get('/skills', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'skills.html'));
});

/**
 * GET /api/portfolio
 * Returns portfolio data as JSON (useful for headless/API consumers)
 */
app.get('/api/portfolio', (req, res) => {
  res.json({
    success: true,
    data: portfolioData,
  });
});

/**
 * GET /api/skills
 * Returns advanced skills data as JSON
 */
app.get('/api/skills', (req, res) => {
  try {
    const skillsData = require('./data/skills-advanced.json');
    res.json({ success: true, data: skillsData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Skills data not found' });
  }
});

/**
 * GET /health
 * Health check endpoint for deployment platforms
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: ENV,
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { data: portfolioData });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({
    success: false,
    message: ENV === 'development' ? err.message : 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('─────────────────────────────────────────');
  console.log(`  🚀 Portfolio Server Running`);
  console.log(`  📍 URL     : http://localhost:${PORT}`);
  console.log(`  🌍 ENV     : ${ENV}`);
  console.log(`  ⏰ Started : ${new Date().toLocaleString()}`);
  console.log('─────────────────────────────────────────');
});

module.exports = app;

// Made with Bob
