// Import the necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import the route handlers
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingItems");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the port, defaulting to 3001
const { PORT = 3001 } = process.env;

// Create an Express application
const app = express();

// Use bodyParser middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);

// Handle non-existent resources
app.use((req, res, next) => {
  res.status(404).send({ message: "Requested resource not found" });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
