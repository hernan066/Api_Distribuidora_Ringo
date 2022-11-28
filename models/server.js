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
      oferts: "/api/oferts",
      deliveryZone: "/api/delivery_zone",
      deliverySubZone: "/api/delivery_sub_zone",
      role: "/api/roles",
      client: "/api/clients",
      clientCategory: "/api/clients_categories",
      clientType: "/api/clients_types",
      distributor: "/api/distributors",
      deliveryTruck: "/api/delivery_trucks",
      employee: "/api/employees",
      salary: "/api/salaries",
      sale: "/api/sales",
      imageKit: "/api/imageKit",
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
    //ImageKit allow cors
    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
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
    this.app.use(this.paths.oferts, require("../routes/ofert"));
    this.app.use(this.paths.deliveryZone, require("../routes/deliveryZone"));
    this.app.use(this.paths.deliverySubZone, require("../routes/deliverySubZone"));
    this.app.use(this.paths.role, require("../routes/role"));
    this.app.use(this.paths.client, require("../routes/client"));
    this.app.use(this.paths.clientCategory, require("../routes/clientCategory"));
    this.app.use(this.paths.clientType, require("../routes/clientType"));
    this.app.use(this.paths.distributor, require("../routes/distributor"));
    this.app.use(this.paths.deliveryTruck, require("../routes/deliveryTruck"));
    this.app.use(this.paths.employee, require("../routes/employee"));
    this.app.use(this.paths.salary, require("../routes/salary"));
    this.app.use(this.paths.sale, require("../routes/sale"));
    this.app.use(this.paths.imageKit, require("../routes/imageKit"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
