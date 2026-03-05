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
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

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

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get(/^(?!\/api).*/, (req, res) => {
    const indexPath = path.join(__dirname, 'client/dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`Not Found. Searched at: ${indexPath}`);
    }
});

const PORT = process.env.PORT || 5001;


// Define Routes

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
