const { hash } = require('bcrypt');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.db', (err)=>{
    if(err){
        console.error("Error connecting to the database", err.message);
    } else{
            console.log("--Connected to the database succesfully--");

            db.run(`
            CREATE TABLE IF NOT EXISTS skills (
                sid INTEGER PRIMARY KEY,
                sname TEXT NOT NULL,
                sdesc TEXT NOT NULL,
                stype TEXT NOT NULL
            )
            `);

            const skills=[
                {"id":"1", "name": "HTML/CSS", "type": "Programming language", "desc": "Creating websites with HTML/CSS"},
                {"id":"2", "name": "C++", "type": "Programming language", "desc": "Programming with C++."},
                {"id":"3", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript on the client side."},
                {"id":"4", "name": "Node.js", "type": "Programming language", "desc": "Programming with Javascript on the server side."},
                {"id":"5", "name": "Express", "type": "Framework", "desc": "Backend Web Application Framework for Node.js"},
                {"id":"6", "name": "Spectre.css", "type": "Framework", "desc": "Creating responsive and modern websites using Spectre CSS Framework."}
            ]

            skills.forEach((oneSkill)=>{
                db.run("INSERT INTO skills (sid,sname,stype,sdesc) VALUES (?,?,?,?)",[oneSkill.id,oneSkill.name,oneSkill.type,oneSkill.desc], (err)=>{
                    if(err){
                        console.error("ERROR: ",err.message);
                    } else{
                        console.log("-Line added into the skills table-");
                    }
                })
            })

            db.run(`
            CREATE TABLE IF NOT EXISTS projects(
                pid INTEGER PRIMARY KEY,
                pname TEXT NOT NULL,
                ptype TEXT NOT NULL,
                pdesc TEXT NOT NULL,
                pyear INTEGER NOT NULL,
                pimgURL TEXT NOT NULL
            )`,(err)=>{
                if(err){
                    console.error("ERROR: ",err.message);
                }else{
                    console.log("---Table projects created succesfully---");
                }
            });

            const projects = [
                {"id":"1", "name":"Toxic Waste Wipeout", "desc":"2D Arcade Game created using Javascript. The purpose of the game is to collect all the Toxic Barrels that fell into the lake before the time runs out and also you need to avoid the mines.","type":"Javascript Game","year":2023,"imgURL":"/img/ToxicWaste.png"},
                {"id":"2", "name":"Madeira Wanderlust", "desc":"This is a digital magazine that presents the breathtaking attractions of Madeira.","type":"Website/Digital Magazine","year":2023,"imgURL":"/img/madeira.png"},
                {"id":"3", "name":"Lunar Lander", "desc":"2D Arcade Game created using Javascript and the p5Canvas library","type":"Javascript Game","year":2023,"imgURL":"/img/Lunar2.png"},
                {"id":"4", "name":"Chef's Choice", "desc":"This website was created to showcase some of the best recipes from all over the world.","type":"Website","year":2022,"imgURL":"/img/RecipeWebsite.png"},
                {"id":"5", "name":"White Moose Gin", "desc":"This project showcases the branding of the White Moose Gin company.","type":"Branding","year":2022,"imgURL":"/img/GinCompany.png"}
            ]

            projects.forEach((oneProject)=>{
                db.run("INSERT INTO projects (pid,pname,pdesc,ptype,pyear,pimgURL) VALUES (?,?,?,?,?,?)", [oneProject.id,oneProject.name,oneProject.desc,oneProject.type,oneProject.year,oneProject.imgURL], (err)=>{
                    if(err){
                        console.error("ERROR: ",err.message);
                    } else{
                        console.log("----Line added into the projects table----");
                    }
                })
            })

            db.run(`CREATE TABLE IF NOT EXISTS users(
                uid INTEGER PRIMARY KEY,
                uname TEXT NOT NULL UNIQUE,
                uhash TEXT NOT NULL,
                uadmin INTEGER NOT NULL
            )`, (err)=>{
                if(err){
                    console.error("ERROR: ",err.message)
                }else{
                    console.log("----Table users succesfully created----")
                }
            })

        

            
            // db.run("INSERT INTO users (uname,uhash,uadmin) VALUES (?,?,?)",["cosmin",$2b$12$q6vAztzHCCDqrZpky1AGPukixVE5mB2ACiFLn8NDO3zRfwOaLDH3y,1],(err)=>{
            //     if(err){
            //         console.error("ERROR inserting user: ",err.message)
            //     } else{
            //         console.log("---User added succesfully----")
            //     }
            // })

            // db.run(`DROP TABLE education`,(err)=>{
            //     if(err){
            //         console.error("ERROR deleting table:",err.message)
            //     }else{
            //         console.log("deleted education")
            //     }
            // })

            db.run(`CREATE TABLE IF NOT EXISTS education(
                eid INTEGER PRIMARY KEY,
                ename TEXT NOT NULL,
                etype TEXT NOT NULL,
                eperiod TEXT NOT NULL,
                elocation TEXT NOT NULL
            )`, (err)=>{
                if(err){
                    console.error("ERROR: ",err.message)
                }else{
                    console.log("-----Table education created succesfully------")
                }
            })
            
            const education = [
                {"eid":"1","ename":"Middle School No.3 Suceava","etype":"Elementary School","eperiod":"2008-2011","elocation":"Romania"},
                {"eid":"2","ename":"Middle School No.3 Suceava","etype":"Middle School","eperiod":"2011-2016","elocation":"Romania"},
                {"eid":"3","ename":"'Petru Rares' National College of Suceava","etype":"High School","eperiod":"2016-2020","elocation":"Romania"},
                {"eid":"4","ename":"'Stefan cel Mare' University of Suceava","etype":"University","eperiod":"2020-2021","elocation":"Romania"},
                {"eid":"5","ename":"Jönköping University","etype":"University","eperiod":"2022-2025","elocation":"Sweden"}
            ]

            education.forEach((school)=>{
                db.run(`INSERT INTO education (eid,ename,etype,eperiod,elocation) VALUES (?,?,?,?,?)`,[school.eid,school.ename,school.etype,school.eperiod,school.elocation], (err)=>{
                    if(err){
                        console.error("ERROR: ",err.message)
                    } else{
                        console.log("--Line added to the education table--")
                    }
                })
            })
            
    }
});

module.exports = db;