const mongoose = require('mongoose');
const {Schema} = mongoose;
const path = require('path');

const NoteSchema = new Schema({
     title: {type: String, required: true},
     description: {type: String, required: true},
     precio: {type: Number, required: true},
     filename:{type: String, required: true},
     date: {type: Date, default: Date.now},
     user: {type: String}
});

NoteSchema.virtual('uniqueId').get(function () {
     return this.filename.replace(path.extname(this.filename), '');
});

module.exports = mongoose.model('Note', NoteSchema);