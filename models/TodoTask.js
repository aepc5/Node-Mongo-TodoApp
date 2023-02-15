// (Concept: Working with a MongoDB Database Directly in Node.js)

const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}) // Concept: Document-oriented database

module.exports = mongoose.model('TodoTask',todoTaskSchema);