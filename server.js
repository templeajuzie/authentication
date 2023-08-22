const express = require("express");
const cors = require("cors")
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const User = require('./Model/UserSchema')
const authRoutes = require('./Routes/Auth/AuthRoutes')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Databaseconnect = require("./db/Database");


Databaseconnect();

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))


app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.use("/api/v1/", authRoutes)

