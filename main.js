const fs = require("fs");

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

const filePath = "./products.json"; // Ruta del archivo donde se guardarán los productos

const productManager = new ProductManager(filePath);

const products = productManager.getProducts();
console.log(products); // []

const product = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};
productManager.addProduct(product);

const updatedProducts = productManager.getProducts();
console.log(updatedProducts);

const productId = 1; // El id del producto a obtener
const productById = productManager.getProductById(productId);
console.log(productById);

const updatedFields = {
  price: 300,
};
productManager.updateProduct(productId, updatedFields);

productManager.deleteProduct(productId);
