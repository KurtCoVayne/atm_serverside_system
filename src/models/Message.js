const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
    nick: { type: String },
    msg: { type: String },
    date: { type: Date, default: Date.now}
})

module.exports = mongoose.model('ChatMessage', ChatSchema)