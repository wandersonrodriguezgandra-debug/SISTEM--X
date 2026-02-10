const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/apr', require('./routes/apr'));
app.use('/api/pt', require('./routes/pt'));
app.use('/api/dds', require('./routes/dds'));
app.use('/api/checklist', require('./routes/checklist'));
app.use('/api/nc', require('./routes/nonconformity'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/inspection', require('./routes/inspection'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: { message: err.message, status: err.status || 500 } });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;