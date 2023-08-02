module.exports = (io) => {
	const deliveryPosition = io.of('/orders/delivery');
	const ordersCashier = io.of('/orders/cashier');

	deliveryPosition.on('connection', (socket) => {
		console.log('Una conexión a socket.io => /orders/delivery');

		socket.on('position', (data) => {
			console.log('CLIENTE EMITIO: ', data);
			if (data?.truckId) {
				deliveryPosition.emit('delivery', data);
			}
		});

		socket.on('disconnect', (data) => {
			console.log('Se desconectó de socket.io');
		});
	});

	ordersCashier.on('connection', (socket) => {
		console.log('Una conexión a socket.io => /orders/cashier');

		socket.on('order', async (data) => {
			console.log('CLIENTE EMITIO: ', data);

			ordersCashier.emit('orderData', data);
		});

		socket.on('disconnect', (data) => {
			console.log('Se desconectó de socket.io');
		});
	});
};
