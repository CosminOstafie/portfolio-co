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

app.get('/projects', (req, res) => {
    db.all("SELECT * FROM projects", function (error, theProjects) {
        if (error) {
            const model = {
                dbError: true,
                theError: error,
                projects: []
            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
        else {
            const model = {
                dbError: false,
                theError: "",
                projects: theProjects
            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
      })
});

app.listen(port,()=>{
    console.log(`Server running and listening on port ${port}`);
})