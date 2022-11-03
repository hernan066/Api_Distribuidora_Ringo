const { Schema, model } = require('mongoose');

const ClientCategorySchema = Schema({
    clientCategory: {
        type: String,
        required: [true]
    }
});


module.exports = model( 'ClientCategory', ClientCategorySchema );