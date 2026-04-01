const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Define Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check endpoint for Render/Deployment platforms
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const fs = require('fs');
const path = require('path');

// Diagnostic route
app.get('/api/debug-paths', (req, res) => {
    const distPath = path.join(__dirname, 'client/dist');
    res.json({
        dirname: __dirname,
        distPath,
        distExists: fs.existsSync(distPath),
        files: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
        envKeys: Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('PORT'))
    });
});

// Diagnostic: List files in client/dist on startup
const distPath = path.join(__dirname, 'client/dist');
const assetsPath = path.join(distPath, 'assets');

console.log('--- Production Asset Check ---');
console.log('Searching for assets at:', distPath);
if (fs.existsSync(distPath)) {
    console.log('Contents of client/dist:', fs.readdirSync(distPath));
    if (fs.existsSync(assetsPath)) {
        console.log('Contents of client/dist/assets:', fs.readdirSync(assetsPath));
    } else {
        console.log('WARNING: client/dist/assets folder not found.');
    }
} else {
    console.log('WARNING: client/dist folder not found.');
}

// Serve static assets in production
app.use(express.static(distPath));
// Fallback: serve assets from the assets folder at the root (solves Vite root request issue)
app.use(express.static(assetsPath));

app.get(/^(?!\/api).*/, (req, res) => {
    const indexPath = path.join(__dirname, 'client/dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`Not Found. Searched at: ${indexPath}`);
    }
});

const PORT = process.env.PORT || 5001;

// Startup validation for production
if (process.env.NODE_ENV === 'production') {
    if (!process.env.MONGO_URI && !process.env.MONGO_URL) {
        console.error('CRITICAL: MONGO_URI is missing from Render Environment Variables.');
    }
    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL: JWT_SECRET is missing from Render Environment Variables.');
    }
}


// Define Routes

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
