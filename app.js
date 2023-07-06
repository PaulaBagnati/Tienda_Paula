const fs = require("fs/promises");
const path = require("path");

const express = require("express");

const products = [
  {
    id: 1,
    title: " REMERA LARA CAMUFLADA",
    description:
      "Remerón de mangas cortas, estilo oversize, con cuello redondo y estampa camuflada acuarelada. La encontrás en color verde",
    price: 13.799,
    stock: 10,
    keywords: [
      "Manga Corta",
      "Escote Redondo",
      "100% Algodón",
      "Mujer",
      "Remeras",
    ],
  },
  {
    id: 2,
    title: "POLERA INDI",
    description:
      "Polera de mangas largas confeccionada en morley soft. Un ítem ideal para el otoño que puede usarse como primera piel por su excelente calce. Contiene 5% de elastano en su composición, por lo cual se adhiere a la figura. La encontrás en color lima, marfil o verde militar.",
    price: 13.799,
    stock: 10,
    keywords: ["Manga Larga", "Polera", "Elastano", "Mujer", "Morley"],
  },
  {
    id: 3,
    title: "REMERA SAUCE",
    description:
      "Remera manga larga con ruedo rústico y detalle de costuras en frente. La encontrás en tonos lima o negro. ",
    price: 10.699,
    stock: 10,
    keywords: [
      "Manga Larga",
      "Escote Redondo",
      "100% Algodón",
      "Mujer",
      "Remera",
    ],
  },
  {
    id: 4,
    title: "REMERA MARY",
    description:
      "Remera de mangas largas y escote redondo, con frunces centrales. Su calce es ajustado al cuerpo, debido a su confección en algodón con 5% de elastano. ",
    price: 7.999,
    stock: 10,
    keywords: ["Manga Larga", "Escote Redondo", "Elastano", "Mujer", "Remera"],
  },
  {
    id: 5,
    title: "REMERA MAIA",
    description:
      "Remerón de estilo oversize, con mangas cortas caídas y cuello redondo. Presenta tajos laterales y estampa central de mariposas. Es levemente más larga en la parte trasera, para darte más cobertura y libertad de movimiento.",
    price: 10.799,
    stock: 10,
    keywords: [
      "Manga Corta",
      "Escote Redondo",
      "100% Algodón",
      "Mujer",
      "Remera",
    ],
  },
  {
    id: 6,
    title: "REMERA HELENA",
    description:
      "Remera lisa, de escote V y mangas cortas. Está confeccionada en algodón y es un básico que no te puede faltar porque combina con todo. De calce regular, no se adhiere a la figura. Suave y fresca, un comodín indispensable que completa todo tipo de looks. La encontrás en dos colores clásicos: negro o blanco.",
    price: 10.799,
    stock: 10,
    keywords: ["Manga Corta", "Escote en V", "Jersey Flamé", "Mujer", "Remera"],
  },
  {
    id: 7,
    title: "TOP AMAIA",
    description:
      "Top de mangas largas estilo princesa, con frunce central y escote en V. Por su confección con lúrex, es de terminación brillosa y calce ajustado al cuerpo. ",
    price: 8.999,
    stock: 10,
    keywords: ["Manga Larga", "Escote en V", "Lurex", "Mujer", "Top"],
  },
  {
    id: 8,
    title: "REMERA ARIES",
    description:
      "Remera de escote cuadrado y mangas cortas, confeccionada en jersey con lurex.",
    price: 8.299,
    stock: 10,
    keywords: ["Manga Corta", "Escote Redondo", "Lurex", "Mujer", "Remera"],
  },
  {
    id: 9,
    title: "REMERA CHENOA",
    description:
      "Remera mangas largas con bordado tipográfico central. La encontrás en color blanco o lima.",
    price: 11.899,
    stock: 10,
    keywords: ["Manga Larga", "Escote Redondo", "Jersey", "Mujer", "Remera"],
  },
  {
    id: 10,
    title: "REMERA SOL",
    description:
      "Remera rayada de mangas largas con cuello media polera. De calce ajustado, se adhiere a la figura.",
    price: 8.499,
    stock: 10,
    keywords: ["Manga Larga", "Polera", "Poliéster", "Mujer", "Remera"],
  },
];

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
    const product = await products.find((p) => p.id === productId);

    if (!product) {
      console.log("Not Found");
      return;
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

// console.log("Primera lectura de archivo");
console.log(p.getProducts());

//Ingreso de productos de prueba
const prod1 = new Promise((resolve, rejected) => {
  resolve(
    p.addProduct({
      title: "producto 1",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25,
    })
  );
});

// prod1.then(() => {
//   const prod = new Promise((resolve, rejected) => {
//     resolve(
//       p.addProduct({
//         title: "producto 2",
//         description: "Este es otro producto de prueba",
//         price: 200,
//         thumbnail: "Sin imagen",
//         code: "abc1235",
//         stock: 25,
//       })
//     );
//   });

//Lectura de un producto de acuerdo a su id
//   prod.then(() => {
//     console.log(p.getProductById(2));
//   });
// });

//Actualización de un producto de acuerdo a su id
// p.updateProduct(2, {
//   title: "producto 2",
//   description: "Este es el producto de prueba actualizado",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc1235",
//   stock: 25,
// });

//Borrado de un producto de acuerdo a su id
//p.deleteProduct(2);
