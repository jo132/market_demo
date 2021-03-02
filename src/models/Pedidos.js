const mongoose = require('mongoose');
const {Schema} = mongoose;

const PedidoSchema = new Schema({
     title:{type: String},
     cantidad: {type: Number, required: true},
     total: {type: Number, required: true},
     date: {type: Date, default: Date.now},
     user: {type: String},
     prod: {type: String}
});

module.exports = mongoose.model('Pedido', PedidoSchema);