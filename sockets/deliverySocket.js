module.exports = (io) => {
	const nameSpace = io.of('/orders/delivery');
	nameSpace.on('connection', (socket) => {
		console.log('Una conexión a socket.io => /orders/delivery');

		socket.on('position', (data) => {
			console.log('CLIENTE EMITIO: ', data);
			if (data?.truckId) {
				nameSpace.emit('delivery', data);
			}
		});

		socket.on('disconnect', (data) => {
			console.log('Se desconectó de socket.io');
		});
	});
};
