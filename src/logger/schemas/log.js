const { Schema } = require('mongoose');

const LogSchema = new Schema({
    successCount: Number,
    failedCount: Number,
    invalidCount: Number,
    memory : Number, //in mb
    processId: Number,
    chunk: Number,
    type: {
        type: String,
        enum: ['rel', 'node'],
    },
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = LogSchema;
