const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

const allApi = require('./api/api');

app.use(express.json());

app.use('/', allApi);

app.listen(PORT);