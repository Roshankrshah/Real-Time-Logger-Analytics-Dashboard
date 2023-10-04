const mongoose = require('mongoose');

const RequestLog = mongoose.model('RequestLog',{
    url: String,
    method: String,
    responseTime: Number,
    day: String,
    hour: Number
});

module.exports = RequestLog;