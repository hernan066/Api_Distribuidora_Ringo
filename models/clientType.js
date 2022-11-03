const { Schema, model } = require('mongoose');

const ClientTypeSchema = Schema({
    clientType: {
        type: String,
        required: [true]
    }
});


module.exports = model( 'ClientType', ClientTypeSchema );