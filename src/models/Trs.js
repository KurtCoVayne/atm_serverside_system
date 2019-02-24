const mongoose = require('mongoose');
const { Schema } = mongoose;

const trsSchema = new Schema({
    find: { type: Boolean, default: true },
    envN: { type: String, required: true },
    envUs: { type: String, required: true },
    recUs: { type: String, required: true },
    msg: { type: String },
    mnt: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    recd: { type: Boolean, default: false },
    rdate: { type: Date }
    // Poner sistema tipo blockchain? O sea, agregar la id de la transaccion anterior
});

module.exports = mongoose.model('Trans', trsSchema);