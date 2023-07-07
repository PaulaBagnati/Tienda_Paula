const products = require("./ProductManager");
const fs = require("fs/promises");
const path = require("path");

const express = require("express");
const app = express();

const port = 8081;

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`funca esta pija en puerto http://localhost:${port}`);
});

app.get("/products", async (req, res) => {
  const productos = await products.getProducts();
  const limite = req.query.limit;

  if (limite) {
    //See only the number of products passed
    var filtro = await productos.filter((producto, indice) => indice < limite);

    res.send(filtro);
  } else {
    //See all products
    res.send(JSON.stringify(productos));
  }
});

app.get("/products/:pid", async (req, res) => {
  const id = req.params.pid;
  const producto = await products.getProductById(id);

  res.send(JSON.stringify(producto, null, 2));
});
