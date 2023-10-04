require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
require('hbs').registerHelper('toJson', data => JSON.stringify(data));
app.set('view engine', 'hbs');


app.get('/',(req,res)=>{
    res.send('starting logger dashboard');
})
const PORT = process.env.PORT || 2323;

app.listen(PORT ,()=>{
    console.log(`Server listening at http://localhost:${PORT}`);
});