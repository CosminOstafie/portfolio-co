const express = require('express');
const {engine} = require('express-handlebars');
const connectSqlite3 = require('connect-sqlite3');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const bcrypt = require("bcrypt");

const db = require('./database');

const port = 1111;
const app= express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views','./views');


//Middlewares (app.use)

app.use(express.static('public'))
app.use((req,res,next)=>{
    console.log('Req.URL: ',req.url)
    next()
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Store sessions in database
const SQLiteStore = connectSqlite3(session);

//Define the session 
app.use(session({
    store: new SQLiteStore({db: "database.db"}),
    "saveUninitialized": false,
    "resave": false,
    "secret":"Mysecretpassword"
}));


//Defining routes
app.get('/',(req,res)=>{
    console.log('SESSION: ', req.session);
    // Hashing the admin password

    // saltRounds = 12
    // bcrypt.hash("12345",saltRounds, function(err,hash){
    //     if(err){
    //         console.error("Error encrypting the password: ",err.message)
    //     } else{
    //         console.log("Hashed password (GENERATE only once): ", hash)
    //     }
    // });

    db.all("SELECT * FROM skills",(error,theSkills)=>{
        if(error){
        const model = {
            dbError: true,
            theError: error,
            skills: [],
            "isAdmin": req.session.isAdmin,
            "isLoggedIn" : req.session.isLoggedIn,
            "name": req.session.name
        };
        // renders the page with the model
        res.render("home.handlebars", model)
        }else{
            const model = {
                dbError: false,
                theError: "",
                skills: theSkills,
                "isAdmin": req.session.isAdmin,
                "isLoggedIn" : req.session.isLoggedIn,
                "name": req.session.name
            };
            
            // renders the page with the model
            res.render("home.handlebars", model)  
        }
    })
    
});

app.get('/login',(req,res)=>{
    const model= { 
    "isAdmin": req.session.isAdmin,
    "isLoggedIn" : req.session.isLoggedIn,
    "name": req.session.name};
    res.render('login',model);
})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE uname=?`;
    db.get(query,[username],(err,row)=>{
        if(err){
            console.error("Database error: ",err);
            res.redirect('/login');
        } else if(!row){
            console.log("User not found");
        }else{
            const hashedPassword = row.uhash;
            bcrypt.compare(password,hashedPassword,(bcryptErr, result)=>{
                if(bcryptErr){
                    console.error("Bcrypt error: ",bcryptErr);
                }else if(result){
                    console.log("Login succesful");
                    req.session.isAdmin = row.uadmin == 1;
                    req.session.isLoggedIn = true;
                    req.session.name = "Cosmin";
                    res.redirect('/');
                } else{
                    console.log("Wrong password.");
                    req.session.isAdmin = false;
                    req.session.isLoggedIn = false;
                    req.session.name = "";
                    res.redirect('/login');
                }
            })
        }
    })
    // if(username == "cosmin" && password == "12345"){
    //     console.log('Cosmin is IN!')
    //     req.session.isAdmin = true;
    //     req.session.isLoggedIn = true;
    //     req.session.name = "Cosmin";
    //     res.redirect('/');
    // } else{
    //     console.log('Wrong username or password');
    //     req.session.isAdmin = false;
    //     req.session.isLoggedIn = false;
    //     req.session.name = "";
    //     res.redirect('/login');
    // }
    
    console.log('FIELDS from the form: '+ username + ',' + password);
})

//route logout
app.get('/logout',(req,res)=>{
    req.session.destroy((error)=>{
        console.log("Error destroying the session, ",error);
    })
    console.log("---Logged out----");
    res.redirect('/');
})


app.get('/skills',(req,res)=>{
    db.all("SELECT * FROM skills",(error,theSkills)=>{
        if(error){
        const model = {
            dbError: true,
            theError: error,
            skills: [],
            "isAdmin": req.session.isAdmin,
            "isLoggedIn" : req.session.isLoggedIn,
            "name": req.session.name
        };
        // renders the page with the model
        res.render("skills.handlebars", model)
        }else{
            const model = {
                dbError: false,
                theError: "",
                skills: theSkills,
                "isAdmin": req.session.isAdmin,
                "isLoggedIn" : req.session.isLoggedIn,
                "name": req.session.name
            };
            // renders the page with the model
            res.render("skills.handlebars", model)  
        }
    })
});

app.get('/about',(req,res)=>{
    console.log('SESSION: ', req.session);
    db.all("SELECT * FROM education",(error,theSchools)=>{
        if(error){
        const model = {
        dbError: true,
        theError: error,
        schools: [],
        "isAdmin": req.session.isAdmin,
        "isLoggedIn" : req.session.isLoggedIn,
        "name": req.session.name
    };  
        res.render('about.handlebars', model);
        } else{
            const model = {
                dbError: false,
                theError: "",
                schools: theSchools,
                "isAdmin": req.session.isAdmin,
                "isLoggedIn" : req.session.isLoggedIn,
                "name": req.session.name
            };  
                res.render('about.handlebars', model);
        }
    }) 
})

app.get('/login',(req,res)=>{
    const model= {};
    res.render('login',model);
})




app.get('/projects', (req, res) => {
    db.all("SELECT * FROM projects", function (error, theProjects) {
        if (error) {
            const model = {
                dbError: true,
                theError: error,
                projects: [],
                "isAdmin": req.session.isAdmin,
                "isLoggedIn" : req.session.isLoggedIn,
                "name": req.session.name
            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
        else {
            const model = {
                dbError: false,
                theError: "",
                projects: theProjects,
                "isAdmin": req.session.isAdmin,
                "isLoggedIn" : req.session.isLoggedIn,
                "name": req.session.name
            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
    })
});

//Delete project route
app.get('/projects/delete/:id',(req,res)=>{
    const id = req.params.id;
    if(req.session.isLoggedIn == true && req.session.isAdmin == true){
        db.run("DELETE FROM projects WHERE pid=?",[id],(error,theProjects)=>{
            if(error){
            const model = {
                dbError: true,
                theError: error,
                "isAdmin": req.session.isAdmin,
                "isLoggedIn" : req.session.isLoggedIn,
                "name": req.session.name }
                res.render("home.handlebars",model)
            }else{
                // const model = { dbError: false,
                //     theError: "",
                //     "isAdmin": req.session.isAdmin,
                //     "isLoggedIn" : req.session.isLoggedIn,
                //     "name": req.session.name} 
                //     res.render("home.handlebars",model)
                
            }
            res.redirect('/projects');
        })
    }else{
        res.redirect('/login');

    }
});

//Route for creating new project

app.get('/projects/new',(req,res)=>{
    if(req.session.isLoggedIn == true && req.session.isAdmin == true){
        const model = {
            "isLoggedIn": req.session.isLoggedIn,
            "name": req.session.name,
            "isAdmin":req.session.isAdmin
    }
    res.render('newproject.handlebars',model);
    } else{
        res.redirect('/login');
    }
});

app.post('/projects/new',(req,res)=>{
    const newp = [
        req.body.projectName,req.body.projectType,req.body.projectDesc,req.body.projectYear,req.body.projectImg
    ]
    if(req.session.isLoggedIn == true && req.session.isAdmin == true){
        db.run("INSERT INTO projects (pname, ptype, pdesc, pyear, pImgURL) VALUES (?,?,?,?,?)",newp,(error)=>{
            if(error){
                console.log("ERROR: ",error);
            }else{
                console.log("<----Line added to the projects table---->")
            }
            res.redirect('/projects');
        })
    } else {
        res.redirect('/login');
    }
});


// Creating routes for updating projects

app.get('/projects/update/:id',(req,res)=>{
const id = req.params.id;
db.get("SELECT * FROM projects WHERE pid=?", [id],(error,theProjects)=>{
    if(error){
        console.log("Error updating project: ",error)
        const model = {
            dbError: true,
            theError: error,
            projects:[],
            isLoggedIn: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
            name: req.session.name
        }
        res.render("modifyproject.handlebars",model)
    }else{
        const model = {
            dbError: false,
            theError: "",
            project: theProjects,
            isLoggedIn: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
            name: req.session.name
        }
        res.render("modifyproject.handlebars",model)
    }
})
});

app.post('/projects/update/:id',(req,res)=>{
    const id = req.params.id;
    const newp = [ 
        req.body.projectName,req.body.projectType,req.body.projectDesc,req.body.projectYear,req.body.projectImg,id
    ];
    if(req.session.isLoggedIn  && req.session.isAdmin ){
        db.run("UPDATE projects SET pname=?, ptype=?, pdesc=?, pyear=?, pimgURL=? WHERE pid=?", newp, (error)=>{
            if(error){
                console.log("Error updating project: ",error)
            }else{
                console.log("Project succesfully updated");
            }
            res.redirect('/projects')
        })
    } else{
        res.redirect('/login')
    }
})

app.listen(port,()=>{
    console.log(`Server running and listening on port ${port}`);
})