// Import the express module
const express = require("express");

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Define the port, defaulting to 3001
const { PORT = 3001 } = process.env;

// Create an Express application
const app = express();

// Define a basic route
//app.get("/", (req, res) => {
// res.send("Hello, world!");
//});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
