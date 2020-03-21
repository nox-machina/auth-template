const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
var cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

//--------------------ROUTES IMPORT--------------------//
const users = require('../routes/users')

const port = process.env.port || 3000

//middleware
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5050"],
    exposedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
  })
);

//db connection
mongoose.connect(`${process.env.DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("connected");
})

app.use(express.json());

//--------------------ROUTES--------------------//
app.use('/', users);

app.listen(port, () => console.log(`Example app deployed on port ${port}!`))