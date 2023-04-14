const express = require('express');
const app = express();
const body_parser = require('body-parser');
const cors = require('cors');
const emailRoutes = require('./routes/Emails');

require('dotenv').config();

app.use(body_parser.json());
app.use(cors());
app.use('/email', emailRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT);
