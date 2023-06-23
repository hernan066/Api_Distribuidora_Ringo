module.exports = (io) => {
	const nameSpace = io.of('/orders/delivery');
	nameSpace.on('connection', (socket) => {
		console.log('Una conexión a socket.io => /orders/delivery');

		socket.on('position', (data) => {
			console.log('CLIENTE EMITIO: ', data);
			/* nameSpace.emit(`position/${data.id_order}`, {
				id_order: data.id_order,
				lat: data.lat,
				lng: data.lng,
			}); */
		});

		socket.on('disconnect', (data) => {
			console.log('Se desconectó de socket.io');
		});
	});
};
