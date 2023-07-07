const fs = require("fs/promises");
const path = require("path");

class ProductManager {
  constructor(path) {
    this.filepath = path;
  }

  //See all products
  async getProducts() {
    try {
      const products = await this.leerDatosFile();

      if (products.length == 0) {
        console.log("No hay productos en archivo");
      }

      //Filter prodcuts by query

      console.log();
      return products;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }

  //Add one product to the array
  async addProduct({ title, description, price, thumbnail, code, stock }) {
    if (
      title == "" ||
      description == "" ||
      price == "" ||
      thumbnail == "" ||
      code == "" ||
      stock == ""
    ) {
      console.log("Por favor, complete todos los datos requeridos");
    } else {
      const products = await this.leerDatosFile();

      if (products.length != 0) {
        let codeExists = await this.existingCode(code);

        if (codeExists) {
          console.log(
            "The code already exists in the array. Please, try with another one"
          );
          return;
        }
      }

      const id = products.length + 1; //Autogenerate ID

      products.push({
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });

      await fs.writeFile(this.filepath, JSON.stringify(products, null, 2));
    }
  }

  //Verify if the code already exists in the products array
  async existingCode(code) {
    const products = await this.leerDatosFile();

    const product = products.find((p) => p.code === code);

    if (product) {
      return 1;
    } else {
      return 0;
    }
  }

  //Get properties of a given Product Id
  async getProductById(productId) {
    const products = await this.leerDatosFile();
    const product = await products.find((p) => {
      if (p.id == productId) {
        return p;
      }
    });

    if (!product) {
      const noexiste = { code: 404, description: "Producto inexistente" };
      return noexiste;
    } else {
      return product;
    }
  }
  
  //Update product data of a given Product Id
  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock }
  ) {
    const products = await this.leerDatosFile();
    const producto = await products.find((p) => p.id === id);

    if (!producto) {
      console.log("Product Not Found");
      return;
    } else {
      var pr = { id, title, description, price, thumbnail, code, stock };

      products.splice(id - 1, 1, pr);

      await fs.writeFile(this.filepath, JSON.stringify(products, null, 2), {
        flag: "w+",
      });
    }
  }

  //Delete product data of a given Product Id
  async deleteProduct(id) {
    const products = await this.leerDatosFile();
    const producto = await products.find((p) => p.id === id);

    if (!producto) {
      console.log("Product Not Found");
      return;
    } else {
      products.splice(id - 1, 1);

      await fs.writeFile(this.filepath, JSON.stringify(products, null, 2), {
        flag: "w+",
      });
    }
  }

  async leerDatosFile() {
    const data = await fs.readFile(this.filepath, "utf-8");

    if (data == "") {
      return [];
    } else {
      const j = JSON.parse(data);

      return j;
    }
  }
}

const p = new ProductManager(path.join(__dirname, "products.json"));

module.exports = p;
