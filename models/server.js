const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categories: "/api/categories",
      brands: "/api/brands",
      products: "/api/products",
      user: "/api/user",
      uploads: "/api/uploads",
      orders: "/api/orders",
      repartidores: "/api/auth/repartidores",
      suppliers: "/api/suppliers",
      productLot: "/api/product_lot",
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));

    // Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.categories, require("../routes/category"));
    this.app.use(this.paths.brands, require("../routes/brand"));
    this.app.use(this.paths.products, require("../routes/product"));
    this.app.use(this.paths.user, require("../routes/user"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
    this.app.use(this.paths.orders, require("../routes/orders"));
    this.app.use(this.paths.repartidores, require("../routes/repartidores"));
    this.app.use(this.paths.suppliers, require("../routes/supplier"));
    this.app.use(this.paths.productLot, require("../routes/productLot"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
