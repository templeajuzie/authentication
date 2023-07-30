const mongoose = require("mongoose");
const dbString = process.env.MONGO_URL;
const localdb = process.env.LOCAL_DB;
const dotenv = require('dotenv').config();

const Databaseconnect = () => {
    mongoose.set('strictQuery', false);

    mongoose.connect(dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("connnected to database successfully")
    }).catch((err) => {
        console.log("invalid database connection" + err)
    })
}

module.exports = Databaseconnect;