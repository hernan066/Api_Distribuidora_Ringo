const existById = async (id, modelo) => {
	// Verificar si el correo existe
	const exist = await modelo.findById(id);
	if (!exist) {
		throw new Error(`El id no existe ${id}`);
	}
};

module.exports = {
	existById,
};
