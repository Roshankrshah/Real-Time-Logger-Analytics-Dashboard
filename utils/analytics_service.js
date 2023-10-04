const RequestLog = require('../models/request_log');

module.exports = {
    getAnalytics(){
        let getTotalRequests = RequestLog.count();

        let getStatsPerRoute = RequestLog.aggregate([
            {
                $group:{
                    _id: {url: '$url', method: '$method'},
                    responseTime: {$avg: '$responseTime'},
                    numberOfRequests: {$sum: 1},
                }
            }
        ]);

        let getRequestPerDay = RequestLog.aggregate([
            {
                $group:{
                    _id: '$day',
                    numberOfRequests: {$sum: 1},
                }
            },
            {$sort: {numberOfRequests: 1}}
        ]);

        let getRequestPerHour = RequestLog.aggregate([
            {
                $group:{
                    _id: '$hour',
                    numberOfRequests: {$sum: 1}
                }
            },
            {$sort: {numberOfRequests: -1}}
        ]);

        let getAverageResponseTime = RequestLog.aggregate([
            {
                $group:{
                    _id: null,
                    averageResponseTime: {$avg: '$responseTime'}
                }
            }
        ]);

        return Promise.all([
            getAverageResponseTime,
            getStatsPerRoute,
            getRequestPerDay,
            getRequestPerHour,
            getTotalRequests
        ]).then(results => {
            return {
                averageResponseTime: results[0][0].averageResponseTime,
                statsPerRoute: results[1],
                requestPerDay: results[2],
                requestPerHour: results[3],
                totalRequest: results[4]
            }
        })
    }
};