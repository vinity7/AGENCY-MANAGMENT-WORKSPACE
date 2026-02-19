const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(bodyParser.json());

// Define Routes
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
