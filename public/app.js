const pusher = new Pusher('4e5c9b8f211ca6c1af8d', { cluster: 'ap2' });

pusher.subscribe('analytics')
    .bind('updated', (data) => {
        console.log(data.analytics);
        document.querySelector('.totalRequest').innerHTML = `${data.analytics.totalRequest}`;
        document.querySelector('.averageResponseTime').innerHTML = `${data.analytics.totalRequest}`;
        document.querySelector('.requestPerDay').innerHTML = `${data.analytics.requestPerDay[0]._id} (${data.analytics.requestPerDay[0].numberOfRequests} requests)`;
        document.querySelector('.requestPerHour').innerHTML = `${data.analytics.requestPerHour[0]._id } (${data.analytics.requestPerHour[0].numberOfRequests} requests)`;
        document.querySelector('.statsPerRoute').innerHTML = `${data.analytics.statsPerRoute[0]._id.method} ${data.analytics.statsPerRoute[0]._id.url} (${data.analytics.statsPerRoute[0].numberOfRequests} requests)`;
        
    })