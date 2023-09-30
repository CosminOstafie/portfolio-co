const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.db', (err)=>{
    if(err){
        console.error("Error connecting to the database", err.message);
    } else{
        console.log("Connected to the database succesfully");








        
    }
});

