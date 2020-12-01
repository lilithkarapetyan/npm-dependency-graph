const { Schema } = require('mongoose');

const LogSchema = new Schema({
    successCount: Number,
    failedCount: Number,
    memory : Number, //in mb
    processId: Number,
    type: {
        type: String,
        enum: ['rel', 'node'],
    },
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = LogSchema;
