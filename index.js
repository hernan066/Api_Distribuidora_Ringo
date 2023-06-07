require('dotenv').config();
const { activeClient } = require('./helpers/active-verify');
const Server = require('./models/server');
const cron = require('node-cron');

const server = new Server();

server.listen();

cron.schedule('0 0 * * *', () => {
	activeClient();
});
