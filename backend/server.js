import express from "express";
import products from "./data/products.js";
import dotenv from "dotenv";
import "colors";
import connectDB from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

//connect to the database
connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("First route");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

//FOR SINGLE PRODUCT
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.send(product);
});

//START THE SERVER ON THE PORT
app.listen(PORT, () =>
  console.log(`Server is ready and running on the port number ${PORT}`)
);
