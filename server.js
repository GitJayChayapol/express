require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const app = express();

const productFile = path.resolve("db", "products.json");
// fs.readFile(productFile, "utf-8").then((raw) => JSON.parse(raw)); ตัวไม่ย่อ

const getProducts = () => fs.readFile(productFile, "utf-8").then(JSON.parse);

app.get("/product/", (req, res) => {
  const { _page = 1, _limit = 10 } = req.query;
  getProducts().then((all) => {
    let start = (_page - 1) * _limit;
    let end = start + +_limit;
    let output = all.slice(start, end);
    res.json({ start, end, output });
  });
});

let port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server on..", port));
