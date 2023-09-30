const express = require('express');
const {engine} = require('express-handlebars');

const db = require('./database');

const port = 1111;
const app= express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views','./views');

app.use(express.static('public'))
app.use((req,res,next)=>{
    console.log('Req.URL: ',req.url)
    next()
})

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/skills',(req,res)=>{
    res.render('skills');
});


app.listen(port,()=>{
    console.log(`Server running and listening on port ${port}`);
})