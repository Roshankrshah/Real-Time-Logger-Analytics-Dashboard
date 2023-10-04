require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const Pusher = require('pusher');

const app = express();

const pusher = new Pusher({
    appId: process.env.APPID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: "ap2",
});

app.set('views', path.join(__dirname, 'views'));
require('hbs').registerHelper('toJson', data => JSON.stringify(data));
app.set('view engine', 'hbs');


app.get('/',(req,res)=>{
    res.send('starting logger dashboard');
})
const PORT = process.env.PORT || 2323;

const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT ,()=>{
            console.log(`Server listening at http://localhost:${PORT}`);
        });
    }catch(err){
        console.log('Error in connecting to server');
    } 
}

start();