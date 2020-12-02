const mongoose = require('mongoose');
const { LogSchema, ErrorSchema } = require('./schemas');

const LogModel = mongoose.model('Log', LogSchema);
const ErrorModel = mongoose.model('_Error', ErrorSchema);

const init = async () => {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);
    return await mongoose.connect(process.env.MONGO_URL);
};

module.exports = {
    LogModel,
    ErrorModel,
    init,
};
