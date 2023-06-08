const express = require("express");
const fs = require("fs");

// Importar la clase ProductManager
class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.lastProductId = 0;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.products = JSON.parse(data);
      if (this.products.length > 0) {
        const lastProduct = this.products[this.products.length - 1];
        this.lastProductId = lastProduct.id;
      }
    } catch (err) {
      console.error("Error al cargar los productos:", err);
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products));
    } catch (err) {
      console.error("Error al guardar los productos:", err);
    }
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    const duplicateProduct = this.products.find((p) => p.code === product.code);
    if (duplicateProduct) {
      console.error("El código del producto ya existe.");
      return;
    }

    product.id = ++this.lastProductId;
    this.products.push(product);
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado.");
      return null;
    }
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedFields,
      };
      this.saveProducts();
    } else {
      console.error("Producto no encontrado.");
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
    } else {
      console.error("Producto no encontrado.");
    }
  }
}

// Crear una instancia de ProductManager
const filePath = "./products.json"; // Ruta del archivo donde se guardarán los productos
const productManager = new ProductManager(filePath);

// Crear una instancia de la aplicación Express
const app = express();
app.use(express.json());

// Ruta '/products'
app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit; // Obtener el valor del parámetro 'limit' de la consulta
    const products = await getProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Ruta '/products/:pid'
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // Obtener el valor del parámetro 'pid' de la URL
    const product = await getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Función para obtener los productos
async function getProducts(limit) {
  const products = productManager.getProducts();
  if (limit) {
    return products.slice(0, limit); // Devolver solo el número de productos solicitado
  }
  return products; // Devolver todos los productos
}

// Función para obtener un producto por su id
async function getProductById(productId) {
  const product = productManager.getProductById(productId);
  if (product) {
    return product;
  }
  throw new Error("Producto no encontrado");
}

// Iniciar el servidor
const port = 8080;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
