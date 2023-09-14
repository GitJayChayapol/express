require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const app = express();

const productFile = path.resolve("db", "products.json");
// fs.readFile(productFile, "utf-8").then((raw) => JSON.parse(raw)); ตัวไม่ย่อ
const deletedFile = path.resolve("db", "deleted.json");

const getProducts = () => fs.readFile(productFile, "utf-8").then(JSON.parse);
const getDeleted = () => fs.readFile(deletedFile, "utf-8").then(JSON.parse);
const saveFile = (file, data) =>
  fs.writeFile(file, JSON.stringify(data, null, 2));

const saveToDeleted = (del_item) => {
  getDeleted().then((all_del) => {
    all_del.push(del_item);
    return saveFile(deletedFile, all_del);
  });
};

app.get("/products/", (req, res) => {
  const { _page = 1, _limit = 10 } = req.query;
  getProducts().then((all) => {
    let start = (_page - 1) * _limit;
    let end = start + +_limit;
    let output = all.slice(start, end);
    res.json({ start, end, output });
  });
});

app.delete("/product/:id", (req, res) => {
  const { id } = req.params;
  getProducts().then((all) => {
    let del_idx = all.findIndex((el) => el.id === +id);
    let [del_item] = all.splice(del_idx, 1);
    saveFile(productFile, all);
    saveToDeleted(del_item);
    res.json({ msg: `Deleted id : ${id}` });
  });
});

let port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server on..", port));
