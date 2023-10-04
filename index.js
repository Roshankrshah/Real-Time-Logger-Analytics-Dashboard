require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const connectDB = require('./config/db');
const moment = require('moment');
const Pusher = require('pusher');
const RequestLog = require('./models/request_log');

const app = express();

const pusher = new Pusher({
    appId: process.env.APPID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: "ap2",
});

app.use((req, res, next) => {
    let requestTime = Date.now();
    res.on('finish', () => {
        if (req.path === '/analytics') {
            return;
        }

        RequestLog.create({
            url: req.path,
            method: req.method,
            responseTime: (Date.now() - requestTime) / 1000,
            day: moment(requestTime).format('dddd'),
            hour: moment(requestTime).hour(),
        });

        require('./utils/analytics_service').getAnalytics()
            .then(analytics => pusher.trigger('analytics', 'updated', { analytics }));
    });
    next();
})

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'layout', helpers: {
        toJson: function (object) {
            return JSON.stringify(object);
        }
    }
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => {
    res.send('starting logger dashboard');
});

app.get('/wait/:seconds', async (req, res) => {
    await ((seconds) => {
        return new Promise(resolve => {
            setTimeout(
                () => resolve(res.send(`Waited for ${seconds} seconds`)),
                seconds * 1000
            )
        });
    })(req.params.seconds)
});

app.get('/analytics', (req, res) => {
    require('./utils/analytics_service').getAnalytics()
        .then(analytics => {
            console.log(analytics);
            res.render('analytics', { analytics })
        });
});


const PORT = process.env.PORT || 2323;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log('Error in connecting to server');
    }
}

start();