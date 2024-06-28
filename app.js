const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/clothingItems");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "667b83fa98d4d8d5f3388639",
  };
  next();
});

app.use("/users", userRoutes);
app.use("/items", itemRoutes);

app.use((req, res, next) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
