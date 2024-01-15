const testFolder = '\\\\192.168.0.188\\';
//const fs = require('fs');
const fs = window.require('fs');
const fse = window.require('fs-extra');
const path = window.require('path');
const {shell} = window.require('electron');
const dotenv = require("dotenv").config({ path: "./process.env" });

// const host = '%npm_package_custom_host%';
// const user = '%npm_package_custom_user%';
// const password = '%npm_package_custom_password%';
// const database = '%npm_package_custom_database%';



const showDot = () => {
}


const specifiedDriveLetter = (window.localStorage.getItem('driveLetter')) ? window.localStorage.getItem('driveLetter') + ':\\' : 'Z';
//   let driveLetter = '';
//   if (window.localStorage.getItem('driveLetter')) {
//     driveLetter = window.localStorage.getItem('driveLetter');
//   } else {
//     driveLetter = 'Z'
//   }

//   console.log(driveLetter);
//   return driveLetter.toUpperCase();
// }

  //   host: '%npm_package_custom_host%',
  //   user: '%npm_package_custom_user%',
  //   password: '%npm_package_custom_password%',
  //   database: '%npm_package_custom_database%'

const updateFileLog = (filepath, fileName, projectSpecs) => {
  const date = new Date();
  const dateString = date.toDateString();
  const timeString = date.toTimeString();
  let status = '';
  let theFileName = fileName;
  let theFilePath = filepath;
  let updatedProjectStatus = '';
  let revised = false;

  if (filepath.includes('revision')) {
    filepath = projectSpecs.status
    revised = true;
  }

  if (filepath.includes('inProgress')) {
    status = 'In Progress'
  } else if (filepath.includes('completed')) {
    status = 'Completed'
  } else if (filepath.includes('archived')) {
    status = 'Archived'
  } else if (filepath.includes('onHold')) {
    status = 'On Hold'
  } else if (filepath.includes('pending')) {
    status = 'Pending'
  } 


  if ((revised) && (projectSpecs != 'null' || projectSpecs != null || projectSpecs > 0 || projectSpecs != 'undefined' || projectSpecs != undefined) && (filepath.includes('revision') || fileName.includes('revision'))) {
    console.log(projectSpecs);
    updatedProjectStatus = `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n
    *** REVISION *** Project Specifications Updated While ${status}: ${dateString} @ ${timeString}\n 
    ${
      (function() {
        let projectText = '';
        for(let entry in projectSpecs) {
          projectText += `\n${entry.toUpperCase()}: ${projectSpecs[entry]}`;      
        }
        return projectText;
      })()
    }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
    theFileName = projectSpecs.project_name;
    theFilePath = path.join(specifiedDriveLetter + '\\waterjetDashboard\\',status,'\\', projectSpecs.client_name, '\\', projectSpecs.project_name);
  } else if (filepath != 'revision') {
    updatedProjectStatus = `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nStatus updated to ${status}: ${dateString} @ ${timeString}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
  }

  fs.appendFile(path.join(theFilePath + '\\' + theFileName + '.txt'), updatedProjectStatus, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      // Get the file contents after the append operation
      console.log("\nFile Contents of file after append:",
        fs.readFileSync(path.join(theFilePath + '\\' + theFileName + '.txt'), "utf8"));
    }
  });
}

const moveDir = (currDir, client, project) => {

  let NEW_PATH;

  console.log(currDir)

  switch(currDir) {
    case 'pending':
      NEW_PATH = specifiedDriveLetter + '\\waterjetDashboard\\inProgress\\' + client + '\\' + project + '\\';
      break;
    case 'inProgress':
      NEW_PATH = specifiedDriveLetter + '\\waterjetDashboard\\completed\\' + client + '\\' + project + '\\';
      break;
    case 'completed':
      NEW_PATH = specifiedDriveLetter + '\\waterjetDashboard\\archived\\' + client + '\\' + project + '\\';
      break;
    case 'archived':
      NEW_PATH = specifiedDriveLetter + '\\waterjetDashboard\\pending\\' + client + '\\' + project + '\\';
      break;
    // case 'archived':
    //   NEW_PATH = specifiedDriveLetter + '\\waterjetDashboard\\archived\\' + client + '\\' + project + '\\';
    //   break;
  }

  const OLD_PATH = specifiedDriveLetter + '\\waterjetDashboard\\'+ currDir + '\\' + client + '\\' + project + '\\';

  fse.move(OLD_PATH, NEW_PATH, err => {
    if(err) return console.error(err);
    console.log('success!');

    updateFileLog(NEW_PATH, project, null);

    fse.remove(OLD_PATH, err => {
      if(err) return console.error(err);
      console.log('dir removed successfully!')
    });

    fs.readdir(path.join(specifiedDriveLetter + '\\waterjetDashboard\\'+ currDir + '\\' + client), function(err, files) {
      if (err) {
         // some sort of error
      } else {
         if (!files.length) {
            // directory appears to be empty
            console.log('empty dir');
            fse.remove(path.join(specifiedDriveLetter + '\\waterjetDashboard\\'+ currDir + '\\' + client), err => {
              if(err) return console.error(err);
            });
         } else {
            console.log('dir got files');
         }
      }
  });

    // fse.remove(path.join(specifiedDriveLetter + '\\waterjetDashboard\\'+ currDir + '\\' + client), err => {
    //   if(err) return console.error(err);
    //   console.log('dir removed successfully!')
    // });

  });
};

const createDir = (client, project, selectedFiles, flatProjectFile) => {

  const encoding = window.require('encoding');
  const date = new Date();
  const dateString = date.toDateString();
  const timeString = date.toTimeString();
  
  let projectDetailsFile = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nDATE CREATED: ${dateString} @ ${timeString}`;


  const addToProjectFile = (item) => {
    const entry = item['entry'];
    const data = item['data'];
    //let projectDetails;

    // const thisJSON = JSON.stringify({
    //   entry: entry,
    //   data: data
    // });
    console.log(entry);
    console.log(data);
    if (entry == 'undefined' || entry == undefined || entry.length < 1 || data == 'undefined' || data == undefined || data.length < 1) {
      console.log('no entry');
      return false;
    } else if (entry == 'files') {

    } else {
      return `\n${entry.toUpperCase()}: ${data}`;
    }


    // console.log(thisJSON);
    // projectDataJSON += thisJSON;
    
    //return thisJSON;
    //return projectDetails;
  }

  flatProjectFile.forEach((item, index) => {
    if(item['entry'] != 'filesss') {
      projectDetailsFile += addToProjectFile(item);
    } else {
      console.log(item['entry']);
    }
  })

  projectDetailsFile += `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~`

  const writeFiles =  (selectedFiles, secondAttempt) => {
    console.log('writeFiles');
    console.log(selectedFiles);
    fs.exists(path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\',  client, project), (exists) => {
      console.log(exists);
      if (exists) {
        
        try {
          fs.writeFileSync(path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\',  client, project, project + '.txt'), projectDetailsFile, 'utf8')
        } catch (err) {
          console.log(err);
        }

        selectedFiles.forEach((item, index) => {
          if (item.hasOwnProperty('svg')) {
            try {
              fs.writeFileSync(path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\',  client, project, item.name), item.svg, 'utf8')
            } catch (err) {
              console.log(err);
            }            
          }
          else {
            try {
              fs.copyFileSync(item.path, path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\', client, project, item.name));
            }
            catch (err) {
              console.log(err);
            }
          }
          //  if ((item.path == undefined || item.path == '' || item.path.length == 0) && item.type == "image/png") {
          //   console.log('item has no path');
          //   let imgData;
          //   let reader = new FileReader();
          //   // reader.readAsDataURL(new Blob([item], {   //was readAsText
          //   //   // "type": "application/png"
          //   //       "type": "image/png"
      
          //   // }));


          //   //var img_b64 = canvas.toDataURL('image/png');
          //   //var png = item.split(',')[1];
          //   //var the_file = new Blob([window.atob(png)],  {type: 'image/png', encoding: 'utf-8'});

          //   // var fr = new FileReader();
          //   // fr.onload = function ( oFREvent ) {
          //   //     var v = oFREvent.target.result.split(',')[1]; // encoding is messed up here, so we fix it
          //   //     v = atob(v);
          //   //     var good_b64 = btoa(decodeURIComponent(escape(v)));
          //   //     document.getElementById("uploadPreview").src = "data:image/png;base64," + good_b64;
          //   // };
          //   //fr.readAsDataURL(the_file);

          //   // reader.readAsDataURL(item, {   //was readAsText
          //   //   // "type": "application/png"
          //   //       "type": "image/png"
      
          //   // });
          //   reader.onload = function(oFREvent) {

          //     console.log(oFREvent);
          //     const text = oFREvent.target.result;

          //     var v = oFREvent.target.result.split(',')[1]; // encoding is messed up here, so we fix it
          //     //v = atob(v);

          //     console.log(v);

          //     const resultBuffer = encoding.convert(text, "Latin_1");

          //     console.log(resultBuffer);

          //     const pngBuffer = "data:image/png;base64," + resultBuffer;
          //     const base64 = fs.readFileSync("2018_banner.jpg", "base64");

          //     console.log(base64);

          //     fs.writeFileSync("new-path.png", pngBuffer);

          //     console.log('bufferasImg');

          //   //   const rb = atob(resultBuffer);

          //   //   //const c = btoa(text);
          //   //   var good_b64 = btoa(rb.replace(/[\u00A0-\u2666]/g, function(c) {
          //   //    return '&#' + c.charCodeAt(0) + ';';
          //   // }));

          //   // console.log(good_b64);

          //       //document.getElementById("uploadPreview").src = "data:image/png;base64," + good_b64;


          //     imgData = reader.result;

          //     console.log(imgData);

          //     const resultBufferimgData = encoding.convert(imgData, "Latin_1");

          //     console.log(resultBufferimgData);

          //     // var vpng = imgData.split(',')[1]; // encoding is messed up here, so we fix it
          //     // vpng = atob(vpng);

          //     // var good_b64 = btoa(vpng.replace(/[\u00A0-\u2666]/g, function(c) {
          //     //   return '&#' + c.charCodeAt(0) + ';';
          //     // }));

          //     // console.log(good_b64);

          //     try {
          //       fs.writeFile(path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\', client, project, item.name), resultBufferimgData, function(err) {
          //         console.log(err);
          //       });
          //       console.log('file writtttten');
          //     }
          //     catch (err) {
          //       console.log(err);
          //     }

          //   };

          //   //reader.readAsDataURL(item);
          //   reader.readAsText(item, "utf-8");
          // } else {
          //   try {
          //     fs.copyFileSync(item.path, path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\', client, project, item.name));
          //     // , fs.constants.COPYFILE_EXCL);      
          //     // // Get the current filenames
          //     // // after the function
          //     // getCurrentFilenames();
          //     // console.log("\nFile Contents of world.txt:",
          //     //   fs.readFileSync("hello.txt", "utf8"));
          //     console.log('else statement');
          //   }
          //   catch (err) {
          //     console.log(err);
          //   }
          // }
        });
      } else if(secondAttempt) {
        setTimeout(() => {
          console.log('tookTwo');
          writeFiles(selectedFiles, null);
        }, 1000)
      } else if (secondAttempt == null) {
        console.log('files could not be written');
      }
      else {
        setTimeout(() => {
          console.log('didntTake');
          console.log(selectedFiles);
          writeFiles(selectedFiles, true)
        }, 1000)
      }
    })
    console.log('writeFileswriteFiles');
  }

  const newDir = () => {
    fse.exists(path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\', client), (exists) => {
      if (exists) {
        fse.mkdirs(path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\', client, project), (err) => {
          if (err) {
              return console.error(err);
          }
          console.log('Sub on existing Directory created successfully!');
          writeFiles(selectedFiles, false);
        });
      } else {
        fs.mkdirSync(path.join(specifiedDriveLetter + '\\waterjetDashboard\\pending\\', client, project), { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          console.log('SubDirectory created successfully! recursive');
          writeFiles(selectedFiles, false);
        });
      }
    });   
  }

  newDir();
  writeFiles(selectedFiles, false);
};

const dbStuff = (crudOp, values, status) => {
    const mysql = window.require('mysql2');
    const SqlString = require('sqlstring');
    const util = require('util');
    const phraseGET = 'SELECT * FROM `projects`';
    const phrase = 'SELECT * FROM `projects`';
    const value2 = 'Test Value 2';
    const formValues = values;
    const readValues = [];
    let crud = crudOp;

    const db_config = {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PWD,
      database: process.env.DB,
    };

    const createNewProject = (values) => {
      let sqlEntry = "";
      let sqlData = "";
      let sqlPhrase = "";
      let fileArrJSON = [];

      console.log(values);

      values.forEach((item, input) => {
        for(let prop in item) {
          console.log(prop);
          console.log(item[prop]);
          console.log(item);
          console.log(item.length)
          if(prop == "files") {
              sqlEntry += '`' + prop + '`, ';
              //sqlData += '"' + JSON.stringify(item) + '", ';

              item[prop].forEach((singleFile)=> {
                let singleFileObj = `{`;
                for(let attr in singleFile) {
                  console.log(typeof(singleFile[attr]))
                  if (typeof(singleFile[attr]) == 'function') {
                    console.log('function: ' + singleFile[attr]);
                  } else {
                    singleFileObj += `'${attr}' : '${singleFile[attr]}',`
                  }
                }
                singleFileObj += `}`

                console.log(singleFileObj)
                console.log(typeof(singleFileObj))
                fileArrJSON.push(singleFileObj);
              })

            sqlData +=  fileArrJSON + ', ';

            console.log(fileArrJSON)
              
            // if (item[prop].includes('step')) {
            //   console.log('!!!!!STEP PROCEDURE!!!!');
            // } else {
            //   sqlEntry += "`" + item[prop] + "`, ";
            // }
            // console.log(prop);
            // console.log(item[prop]);
            // console.log(item);
          } else if(prop == "entry") {
            if (item[prop].includes('step')) {
              console.log('!!!!!STEP PROCEDURE!!!!');
            } else {
              sqlEntry += "`" + item[prop] + "`, ";
            }
          } else if(prop == "data") {
            if (item[prop] == undefined || item[prop] == 'undefined') {
              console.log('undefined');
            } else {
              sqlData += '"' + item[prop] + '", ';
            }
          
          }
        }
      });
      sqlEntry = sqlEntry.slice(0,-2);
      sqlData = sqlData.slice(0,-2);

      sqlPhrase = 'INSERT INTO `projects`(' + sqlEntry + ', `status`, `cut_time`, `labor_time`' + ') VALUES (' + sqlData + ', "pending", "0", "0")';

      console.log(sqlPhrase)

      return sqlPhrase;
    }

    const runQuery = (crud, phrase) => {
      let $query;

      updateFlatDbStatus(status);

      switch (crud) {
        case 'create':
          console.log('op to create');
          $query = createNewProject(values);
          break;
        case 'read':
          console.log('op to read');
          console.log(status);
          $query = retrieveProjects(status);
          break;
        case 'update':
          $query = updateProject(projectId);
          console.log('op to update');
          break;
        case 'delete':
          console.log('op to delete');
          break;
        default:
          console.log('no op recognized...crud');
      }
      console.log('queryRunning');
      console.log(formValues);

      const userId = 1;
      //const sql = SqlString.format('SELECT * FROM completed` WHERE id = ?', [userId]);
      const sql = SqlString.format($query);
      console.log(sql); // SELECT * FROM users WHERE id = 1
      // execute will internally call prepare and query
      // connection.execute(
      //     phrase,
      //     function(err, results, fields) {
      //     console.log(results); // results contains rows returned by server
      //     console.log(fields); // fields contains extra meta data about results, if available
      
      //     // If you execute same statement again, it will be picked from a LRU cache
      //     // which will save query preparation time and give better performance
      //     }
      // );
      // node native promisify
      const query = util.promisify(connection.query).bind(connection);

      connection.query(sql, function(err, rows, fields) {
          if(err){
              console.log("An error ocurred performing the query.");
              console.log(err);
              return;
          }

          console.log("Query succesfully executed", rows);
          const rowsJSON = JSON.stringify(rows);

          console.log(rowsJSON);

          //results.push(rows);
          
          //window.sessionStorage.setItem('pendingJSON', rowsJSON);
          window.sessionStorage.setItem(status + 'JSON', rowsJSON);

          if (crud == "read") {
            let numVar = 0;
            for(const row in rows) {
              numVar++;
              //window.localStorage.setItem('pending' + numVar , rows[row]);
            }
          }
      });
      //Close the connection
      connection.end(function(){
          // The connection has been closed
      });
    };

    const results = [];
      
    var connection;
      
    function handleDisconnect() {
      console.log('connectAttaempt');
      connection = mysql.createConnection(opts); // Recreate the connection, since
                                                      // the old one cannot be reused.
    
      connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }           
        else {
          console.log('connected to db');
          //getDB(crud, phraseGET);
          const connectToDB = new Promise((resolve, reject) => {
            resolve(runQuery(crud, phrase));
            //resolve(indexedDB(phrase));
            //resolve(dbConn(phrase));
          });

          connectToDB;
        
        }                          // to avoid a hot loop, and to allow our node script to
      });                                     // process asynchronous requests in the meantime.
                                              // If you're also serving http, display a 503 error.
      connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });
    }

    handleDisconnect();
    return results;
}

const retrieveProjects = (status) => {
  let sqlPhrase = "";

  if (status == 'clients') {
    sqlPhrase = 'SELECT * FROM `clients`';
  } else {
    sqlPhrase = 'SELECT * FROM `projects` WHERE status="' + status + '"';
  }

  return sqlPhrase;
}

const updateProject = (projectId, newStatus) => {
  console.log('updateProject# ', projectId);
  let updatedStatus = "completed"
  const sqlPhrase = 'UPDATE `projects` SET `status`="' + newStatus + '" WHERE id="' + projectId + '"';

  return sqlPhrase;
}

const reviseProjectQuery = (revisedProject) => {
  let sqlEntry;
  let sqlData;
  let sqlCouples = ``;

  for(let prop in revisedProject) {
    if (prop != 'date') {
      if (prop == 'revised') {
        const date = new Date();
        const dateString = date.toDateString();
        const timeString = date.toTimeString();
        sqlEntry = 'revised';
        sqlData = '"' + dateString + " @ " + timeString + '"';
      } else {
        sqlEntry = prop;
        sqlData = '"' + revisedProject[prop] + '"';
      }

      sqlCouples += sqlEntry + ' = ' + sqlData + ", "
    }
  }

  const sqlRevise = sqlCouples.slice(0,-2);
  const sqlPhrase = 'UPDATE projects SET ' + sqlRevise + ' WHERE id="' + revisedProject.id + '"';

  return sqlPhrase;
}

const reviseProject = (revisedProject) => {
  const reviseSQLQuery = reviseProjectQuery(revisedProject);

  dbConnect('revise', reviseSQLQuery);
  updateFileLog('revision', 'revision', revisedProject)
}

const buildQuery = (crud, credentials) => {
  const SqlString = require('sqlstring');
  let $query;

  updateFlatDbStatus(credentials);

  console.log(credentials);

  switch (crud) {
    case 'create':
      console.log('op to create');
      $query = createNewProject(values);
      break;
    case 'read':
      console.log('op to read');
      console.log(credentials);
      $query = retrieveProjects(credentials);
      break;
    case 'update':
      $query = updateProject(credentials.id, credentials.status);
      console.log('op to update');
      break;
    case 'delete':
      console.log('op to delete');
      break;
    case 'revise':
      $query = credentials;
      console.log('op to revise');
      break;
    default:
      console.log('no op recognized...crud');
  }
  
  const userId = 1;
  const sql = SqlString.format($query);

  console.log(sql);
  
  return sql;
}

const dbConnect2 = () => {
  let connectionrequest = require('./connectionrequest')

  controllermethod: (req, res, next) => {
      //establish the connection on this request
      connection = connectionrequest()

      //run the query
      connection.query("select * from table", function (err, result, fields) {
          if (err) {
              // if an error occurred, send a generic server failure
              console.log(`not successful! ${err}`)
              connection.destroy();

          } else {
              //if successful, inform as such
              console.log(`query was successful, ${result}`)

              //send json file to end user if using an api
              res.json(result)

              //destroy the connection thread
              connection.destroy();
          }
      });
  }
}

//WORKING CONNECTION VVV
//const dbConfigInfo = window.require('./config/db.local');
const dbConfigInfo = window.require('dotenv').config()
console.log(process.env.USER)


const opts = {

}


const dbConnect = (crud, creds) => {
  const mysql = window.require('mysql2');
  const util = require('util');
  let sqlQuery = "";

  // const opts = {
  //   host: process.env.HOST,
  //   user: process.env.USER,
  //   password: process.env.PWD,
  //   database: process.env.DB,
  // };

  // const db_config = {
  //   host: process.env.HOST,
  //   user: process.env.USER,
  //   password: process.env.PWD,
  //   database: process.env.DB,
  // }

    
  var connection;
    
  function handleDisconnect() {

    sqlQuery = buildQuery(crud, creds);

    console.log('connectAttaempt');
  
    connection = mysql.createConnection(opts); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });

    connection.promise().query(sqlQuery)
    .then( ([rows,fields]) => {
      const rowsJSON = JSON.stringify(rows);
      window.sessionStorage.setItem(creds + 'JSON', rowsJSON);
    })
    .catch(console.log)
    .then( () => setTimeout(()=> {connection.end()}, 1000));
  }

  handleDisconnect();
}

// const dbConnect = (crud, creds) => {
//   const mysql = window.require('mysql2');
//   const mysql2 = window.require('mysql2/promise');
//   const genericPool = window.require('generic-pool');
//   const dbConfigInfo = window.require('./config/db.local');

//   const util = require('util');
  
//   let sqlQuery = "";

//   // const db_config = {
//   //   host: process.env.HOST,
//   //   user: process.env.USER,
//   //   password: process.env.PWD,
//   //   database: process.env.DB
//   // };

//   // const db_config = {
//   //   host: '%npm_package_custom_host%',
//   //   user: '%npm_package_custom_user%',
//   //   password: '%npm_package_custom_password%',
//   //   database: '%npm_package_custom_database%'
//   // }

//   //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//   //import mysql2 from "mysql2/promise";
// //import genericPool from "generic-pool";
// //import dbConfigInfo from "../config/db.local";

//   const opts = {
//       host: dbConfigInfo.host,
//       user: dbConfigInfo.username,
//       password: dbConfigInfo.password,
//       database: dbConfigInfo.database,
//   };

//   //sqlQuery = buildQuery(crud, creds);

//   console.log(creds);

//   // const PoolDB = genericPool.createPool({
//   //     create : () => mysql2.createConnection(opts),
//   //     destroy : (connection) => connection.end(),
//   //     validate : (connection) => connection.promise().query(`SELECT 1`).then( ([rows,fields]) => {
//   //       const rowsJSON = JSON.stringify(rows);
//   //       window.sessionStorage.setItem(creds + 'JSON', rowsJSON);
//   //     })
//   //     .then(()=>true,()=>false),
//   // }, {
//   //     max : 5,
//   //     min : 0,
//   //     testOnBorrow : true
//   // });
//   // const db = {
//   //     execute : async (sql, values, cb) => {
//   //         let conn;
//   //         console.log(sql);
//   //         //console.log(values);
//   //         //console.log(cb);
//   //         try{
//   //             conn = await PoolDB.acquire();
//   //             const r = await conn.execute(sql);
//   //             await PoolDB.release(conn);
//   //             console.log('connectingingingingninging');
//   //             return r;
//   //         }catch(e){
//   //             if(conn) await PoolDB.destroy(conn);
//   //             console.log('not connectingingingingninging');
//   //             throw e;
//   //         }
//   //     },
//   // };

//   // db.execute(sqlQuery);
    
//   var connection;
    
//   function handleDisconnect() {

//     sqlQuery = buildQuery(crud, creds);

//     console.log('connectAttaempt677');
  
//     connection = mysql.createConnection(opts); // Recreate the connection, since
//                                                     // the old one cannot be reused.

//     connection.on('error', function(err) {
//       console.log('db error', err);
//       if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//         handleDisconnect();                         // lost due to either server restart, or a
//       } else {                                      // connnection idle timeout (the wait_timeout
//         throw err;                                  // server variable configures this)
//       }
//     });

//     connection.promise().query(sqlQuery)
//     .then( ([rows,fields]) => {
//       console.log('693693693');
//       const rowsJSON = JSON.stringify(rows);
//       window.sessionStorage.setItem(creds + 'JSON', rowsJSON);
//     })
//     .catch(console.log)
//     .then( () => connection.end());
//   }

//   handleDisconnect();
// }

const logToConsole = (msg) => {
  console.log(msg);
}

const updateStatus = (projectId, currStatus) => {
  console.log('projectId= ', projectId);
  let newStatus = "";

  switch(currStatus) {
    case 'pending':
      newStatus = "inProgress";
      break;
    case 'inProgress':
      newStatus = "completed";
      break;
    case 'completed':
      newStatus = "archived";
      break;
    case 'archived':
      newStatus = "pending";
      break;
  }

  const updateCreds = {
    'id': projectId,
    'status': newStatus
  }

  dbConnect('update', updateCreds);
  //dbConnect2();
}

const showProjects = (status) => {
  const showProjects = new Promise((resolve, reject) => {
    resolve(dbConnect('read', status));
  });
}

const getClients = () => {
  const showClients = new Promise((resolve, reject) => {
    resolve(dbConnect('read', 'clients'));
  });
}

const addClient = () => {
  const addClientToClients = 'new client';
  console.log(addClientToClients)
}

const modalWindow = (title) => {
  const modalContainer = document.createElement('div');
  const modal = document.createElement('div');

  modalContainer.classList.add('modal-container');
  modal.classList.add('modal');

  modalContainer.addEventListener('click', function(evt) {
    console.log(evt.target);
    evt.target.classList.add('hidden');
  })

  const modalContent = `<div class="modal-content">
                        <p class="title">${title}</p>
                        </div>`;

  modalContainer.appendChild(modal);
  window.document.body.appendChild(modalContainer);
}
import * as parse from './node_modules/dxf-parser/dist/dxf-parser.js';


const dxfHandle = (dxfFile, projectFile, cadElem, dxfContent) => {
  const parse = window.require('dxf-parser');

  //const threeDXF = window.require('three-dxf');

  const THREE = window.require('three');
  const DXFLoader = window.require('three-dxf-loader');

  //const dxfViewer = window.require('dxf-viewer');
  // three/src/loaders/FontLoader.js

  console.log(cadElem);
  // let cadCanvas;



  console.log(dxfFile);
  console.log(parse);
  //console.log(threeDXF);
  
  console.log(projectFile);


  function printFile(projectFile) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      console.log(evt.target.result);
    };
    console.log(reader.readAsText(projectFile));
  }

  //printFile();



  const onFileLoadingSuccess = (event) => {

    //console.log(dxfBlob);
    //const fileReader = event.target;
    const fileReader = dxfBlob;
    if (fileReader.error) return console.log("error onloadend!?");
  
    console.log(fileReader.result);
  
    var parser = new DxfParser();
    const dxf = parser.parseSync(fileReader.result);
    const canvas = new Viewer(dxf, document.getElementById("canvas"), 400, 400);
  
    // const parser = new DXFParser();
    // const dxf = parser.parseSync(fileReader.result);
  
    // if (dxf) {
    //   console.log(JSON.stringify(dxf, null, 2));
    // } else {
    //   console.log("No Data");
    // }
  
    // Three.js changed the way fonts are loaded, and now we need to use FontLoader to load a font
    //  and enable TextGeometry. See this example http://threejs.org/examples/?q=text#webgl_geometry_text
    //  and this discussion https://github.com/mrdoob/three.js/issues/7398
    // var font;
    // var loader = new THREE.FontLoader();
    // loader.load( 'fonts/helvetiker_regular.typeface.json', function ( response ) {
    //     font = response;
    //     cadCanvas = new window.ThreeDxfLoader.Viewer(dxf, document.getElementById('cad-view'), 400, 400, font);
    // });
  };

  const reader = new FileReader();
  //reader.onloadend = onFileLoadingSuccess(event);
  // const filAsText = reader.readAsText(dxfFile);

  let fileText;
  let font;

  //console.log(fileAsText);

  fs.readFile('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + data);
    font = data;
  });

  fs.readFile(dxfFile, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + dxfFile);
    fileText = data;

    let cadCanvas;

    console.log(data);

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    console.log(blob);

    // printFile(blob);

      // See index.js in the sample for more details
      var parser = new parse();
      //var dxf = parser.parseSync(fileReader.result);
      var dxf = parser.parseSync(data);

      if(dxf) {
        dxfContent.innerHTML = JSON.stringify(dxf, null, 2);
    } else {
        dxfContent.innerHTML = 'No data.';
    }

      console.log(dxf);
      console.log(cadElem);
      //console.log(threeDXF);

      // import * as THREE from 'three'
      // import { DXFLoader } from 'three-dxf-loader'

      const url = dxfFile;

      drawDXF(dxfFile);
  });

  const drawDXF = (dxfFile) => {
    const loader = new DXFLoader.DXFLoader();
    const loaderTHREE = new THREE.FileLoader();

    loaderTHREE.load( './fonts/helvetiker_regular.typeface.json', function ( response ) {
      font = response;
    });

      loader.setFont(font); // set fonts
      loader.setEnableLayer(true); // set EnableLayer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      const onLoad = (data) => {
          if (data && data.entities) {
            data.entities.forEach((ent) => {
              scene.add(ent)
            })
          }

          camera.position.z = 15;
          setTimeout(() => {
            animate();
          }, 1000);mm
      }
      const onError = (error) => {
        console.log(error);
      }
      const onProgress = (xhr) => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
      }
  }
}

const dxfImgPreview = (filePath, svgElem, tgtImage, contentCont) => {
const dxf = window.require('./dist/dxf');

console.log(filePath);
console.log('^filePath^');

  const getDXFFile = (filePath) => {
    fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + filePath);
    const fileText = data;
    //return fileText;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    return blob;
  })
  }

  const fileAsBlob = getDXFFile(filePath);
  fileAsBlob;

  const svgToImg = (svgElem) => {
    console.log('svging');
    const contentCont = document.querySelector('#content-container');
    const mySVG    = svgElem.querySelector('svg');    // Inline SVG element
    //const mySVG    = document.querySelector('#svg svg');    // Inline SVG element
    //const tgtImage = document.querySelector('.svg-to-img');      // Where to draw the result
    const can      = document.createElement('canvas'); // Not shown on page
    const ctx      = can.getContext('2d');
    const loader   = new Image;

    loader.width  = can.width  = tgtImage.width;
    loader.height = can.height = tgtImage.height;

    document.body.appendChild(can);

    loader.onload = function(){
      ctx.drawImage( loader, 0, 0, loader.width, loader.height );
      tgtImage.src = can.toDataURL();
      console.log('loadededed');
    };
    var svgAsXML = (new XMLSerializer).serializeToString( mySVG );
    loader.src = 'data:image/svg+xml,' + encodeURIComponent( svgAsXML );

    contentCont.appendChild(loader);

  }

  //var numberOfEntities = document.getElementById('numberOfEntities')
      //var svgContainer = document.getElementById('svg')
      //var fileInput = document.getElementById('file')
      // window.require(['../dist/dxf'], function (dxf) {
      const dxfFunction = (dxf) => {
        dxf.config.verbose = true
        //fileInput.addEventListener('change', function (event) {
          //var file = event.target.files[0];
          //var file = getDXFFile(filePath);
          //var reader = new FileReader();
          //numberOfEntities.innerHTML = 'reading...'
          // reader.onload = function (e) {
          //   if (e.target.readyState === 2) {
          //     var dxfContents = e.target.result
          //     var helper = new dxf.Helper(dxfContents)
          //     //numberOfEntities.innerHTML = helper.denormalised.length
          //     const svg = helper.toSVG()
          //     //svgContainer.innerHTML = svg
          //     svgElem.innerHTML = svg
          //     svgToImg(svgElem);
          //   }
          // }

          const file = new File([filePath], 'hello_world.dxf');
            //or const file = document.querySelector('input[type=file]').files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const blob = new Blob([new Uint8Array(e.target.result)], {type: file.type });
                console.log(blob);
            };
            reader.readAsArrayBuffer(file);
          //reader.readAsBinaryString(file)
          //const newBlobFromFile = new File([filePath], 'temp_file.dxf');
          reader.readAsBinaryString(file);
        //})
      }
      dxfFunction(dxf);

    }

    const updateFlatDbStatus = (updatedStatus) => {
      const secondAttempt = true;

      console.log(updatedStatus);

      const projectDetailsFile = '5678';
      const now = new Date();

      fs.writeFileSync(path.join(specifiedDriveLetter + '\\waterjetDashboard\\_db_time\\.db_update.txt'),
        "=====\n" + "DB Modified " +  now.toString() + "\n" +
        updatedStatus.id + " has been updated to " + updatedStatus.status + "\n" +
        "=====\n",
        {
          encoding: "utf8",
          flag: "a+",
          mode: 0o666
      });
       
      console.log(fs.readFileSync(path.join(specifiedDriveLetter + "\\waterjetDashboard\\_db_time\\.db_update.txt"), "utf8"));

      fs.watchFile(path.join(specifiedDriveLetter + "\\waterjetDashboard\\_db_time\\.db_update.txt"), (curr, prev) => { 
        console.log("\nThe File was modified"); 
        console.log("Previous Modification Time", prev.mtime); 
        console.log("Current Modification Time", curr.mtime); 
      }); 
    } 


export { dbStuff, createDir, moveDir, updateStatus, reviseProject, showProjects, addClient, getClients, modalWindow, dxfHandle, dxfImgPreview, updateFlatDbStatus, showDot };
