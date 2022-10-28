const Role = require('../models/role');
const { Usuario, Categoria, Producto, Repartidor } = require('../models');


const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}
const telefonoExiste = async( telefono ) => {

    // Verificar si el correo existe
    const existeTelefono = await Usuario.findOne({ telefono });
    if ( existeTelefono ) {
        throw new Error(`El teléfono: ${ telefono }, ya está registrado`);
    }
}
const patenteExiste = async( patente = '' ) => {

    // Verificar si el correo existe
    const existePatente = await Repartidor.findOne({ patente });
    if ( existePatente ) {
        throw new Error(`La patente: ${ patente }, ya está registrada`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
const existeRepartidorPorId = async( id ) => {

    // Verificar si el correo existe
    const existeRepartidor = await Repartidor.findById(id);
    if ( !existeRepartidor ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Categorias
 */
const existeCategoriaPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
    existeRepartidorPorId,
    patenteExiste,
    telefonoExiste
}

