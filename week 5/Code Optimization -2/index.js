const express = require('express');
require('dotenv').config();
const app = express();

const schema = require("./schema/user.schema");

const userApi = require("./api endpoint/user.api");
app.use(express.json());
app.use('/user', userApi);

app.listen(process.env.PORT);