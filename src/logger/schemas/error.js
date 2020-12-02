const { Schema } = require('mongoose');

const ErrorSchema = new Schema({
    processId: Number,
    package: String,
    type: {
        type: String,
        enum: ['rel', 'node'],
    },
    chunk: Number,
    message: String,
    stack: String,
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = ErrorSchema;
