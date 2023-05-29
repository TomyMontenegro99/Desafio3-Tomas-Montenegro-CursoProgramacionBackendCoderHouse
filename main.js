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

// Ejemplo de uso:
const productManager = new ProductManager();

// Agregar productos
productManager.addProduct({
  title: "Producto 1",
  description: "Descripción sobre el producto 1",
  price: 10.99,
  thumbnail:
    "https://st2.depositphotos.com/1867553/10855/i/600/depositphotos_108556934-stock-photo-capybara-in-the-national-park.jpg",
  code: "P1",
  stock: 5,
});

productManager.addProduct({
  title: "Producto 2",
  description: "Descripción sobre el producto 2",
  price: 19.99,
  thumbnail:
    "https://st2.depositphotos.com/1867553/10855/i/600/depositphotos_108556934-stock-photo-capybara-in-the-national-park.jpg",
  code: "P2",
  stock: 3,
});

// Obtener todos los productos
const allProducts = productManager.getProducts();
console.log(allProducts);

productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

//Vuelvo a mostrar los productos
const newProducts = productManager.getProducts();
console.log(newProducts);

//Intento agregar el mismo producto
productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

// Obtener un producto por su id
const product = productManager.getProductById(1);
console.log(product);

// Intentar obtener un producto con un id inexistente
const nonExistentProduct = productManager.getProductById(10);
