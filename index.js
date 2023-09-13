const express = require('express');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./database/config');
const { logger } = require('./middlewares/logsEvents');
const credentials = require('./middlewares/credentials');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/logsErrors');
require('dotenv').config();
const { activeClient } = require('./helpers/active-verify');
const cron = require('node-cron');

const app = express();
const http = require('http');
const server = http.createServer(app);
const ordersSocket = require('./sockets/deliverySocket');
const io = require('socket.io')(server, {
	cors: { origin: '*' },
});

// ------------connect to db ------------

const connection = async () => {
	await dbConnection();
};
connection();
// ---------middlewares-------------

// Logs
app.use(logger);

// Credentials
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// Lectura y parseo del body
app.use(express.json());

// Lectura y parseo del body
app.use(cookieParser());

// Directorio Público
app.use(express.static('public'));

// Fileupload - Carga de archivos
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
		createParentPath: true,
	})
);
// ImageKit allow cors
app.use(function (req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*");
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// --------------Socket-------------
ordersSocket(io);

// -------------routes-----------
app.use('/api/auth', require('./routes/auth'));
app.use("/api/buscar'", require('./routes/buscar'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/brand', require('./routes/brand'));
app.use('/api/products', require('./routes/product'));
app.use('/api/user', require('./routes/user'));
app.use('/api/uploads', require('./routes/uploads'));

app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth/repartidores', require('./routes/repartidores'));
app.use('/api/suppliers', require('./routes/supplier'));
app.use('/api/product_lot', require('./routes/productLot'));
app.use('/api/oferts', require('./routes/ofert'));

app.use('/api/delivery_zone', require('./routes/deliveryZone'));
app.use('/api/delivery_sub_zone', require('./routes/deliverySubZone'));
app.use('/api/roles', require('./routes/role'));
app.use('/api/clients', require('./routes/client'));
app.use('/api/clients_categories', require('./routes/clientCategory'));

app.use('/api/clients_types', require('./routes/clientType'));
app.use('/api/clients_addresses', require('./routes/clientAddress'));
app.use('/api/distributors', require('./routes/distributor'));
app.use('/api/delivery_trucks', require('./routes/deliveryTruck'));
app.use('/api/employees', require('./routes/employee'));

app.use('/api/salaries', require('./routes/salary'));
app.use('/api/sales', require('./routes/sale'));
app.use('/api/imageKit', require('./routes/imageKit'));
app.use('/api/reports', require('./routes/report'));
app.use('/api/points', require('./routes/points'));
app.use('/api/recommendation', require('./routes/recommendation'));

app.use('/api/orderActive', require('./routes/ordersActive'));
app.use('/api/config', require('./routes/config'));

// -----------error----------------
app.use(errorHandler);

// -----------Listen----------------

server.listen(process.env.PORT || 3040, () => {
	console.log('Servidor corriendo en puerto', process.env.PORT);
});

cron.schedule('0 0 * * *', () => {
	activeClient();
});
