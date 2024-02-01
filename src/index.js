const { app, BrowserWindow, ipcMain, shell, ipcRenderer, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
// Get the client
const mysql = require('mysql2');
const chokidar = require('chokidar');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


ipcMain.on('get-file', (event, fileName, specifiedDriveLetter) => {
  const pathString = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\' + fileName + '.json');

  if (fs.existsSync(path.join(specifiedDriveLetter + '\\waterjetData_testDir\\'))) {
    const data = fs.readFileSync(pathString, 'utf8');

    event.sender.send('get-file-response', data, fileName)
    console.log('file got and res and logged');
  } else {
    console.log('no exist - getFile');
  }
});

ipcMain.on('create-or-relocate-directory', (event, action, projectSpecs, specifiedDriveLetter) => {
  console.log(projectSpecs, ' :29');
  console.log(action, ' :30');

  if (action == 'dump') {
    const pathStringClient = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\fileQueue');
    console.log(projectSpecs)

    if (fs.existsSync(pathStringClient)) {
      console.log('pathStringClient exists: 37');
    } else {
      fs.mkdirSync(pathStringClient);
      console.log('pathStringClient created: 40');
    }

    projectSpecs.forEach((tempFileObj) => {
      fs.copyFileSync(tempFileObj.path, path.join(pathStringClient + '\\' + tempFileObj.name + '.' + tempFileObj.type));
    })
  } else if (action == 'revive') {
     const pathStringClientArchived = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\archived\\' + projectSpecs.client_name);
     const pathStringClientProjectArchived = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\archived\\' + projectSpecs.client_name + '\\' + projectSpecs.project_name);
     const pathStringClient = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\pending\\' + projectSpecs.client_name);
     const pathStringClientProject = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\pending\\' + projectSpecs.client_name + '\\' + projectSpecs.project_name);
     
     fs.cp(pathStringClientProjectArchived, pathStringClientProject, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('dir copied successfully!');
    });
  
  } else if (action == 'remove') {
      const pathStringClient = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\pending\\' + projectSpecs.client_name);
      const pathStringClientProject = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\pending\\' + projectSpecs.client_name + '\\' + projectSpecs.project_name);
  
      setTimeout(() => {
        fse.remove(pathStringClientProject, err => {
          if(err) return console.error(err);
          console.log('dir removed successfully!')
        });
    
        fs.readdir(pathStringClientProject, function(err, files) {
          if (err) {
             // some sort of error
          } else {
             if (!files.length) {
                // directory appears to be empty
                console.log('empty dir');
                fse.remove(pathStringClientProject, err => {
                  if(err) return console.error(err);
                });
             } else {
                console.log('dir got files');
  
             }
          }
        });
      }, 1000);

      console.log('remove');
    

  } else {

  console.log(action);

  console.log('else');
    const pathStringClient = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\pending\\' + projectSpecs.client_name);
    const pathStringClientProject = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\pending\\' + projectSpecs.client_name + '\\' + projectSpecs.project_name);
    const pathStringClientArchived = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\archived\\' + projectSpecs.client_name);
    const pathStringClientProjectArchived = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\archived\\' + projectSpecs.client_name + '\\' + projectSpecs.project_name);


    if (fs.existsSync(pathStringClient)) {
      console.log('pathStringClient exists: 151');
    } else {
      fs.mkdirSync(pathStringClient);
      console.log('pathStringClient created: 154');
    }

    if (fs.existsSync(pathStringClientArchived)) {
        console.log('pathStringClient exists: 151');
      } else {
        fs.mkdirSync(pathStringClientArchived);
        console.log('pathStringClient created: 154');
      }

    if (fs.existsSync(pathStringClientProject)) {
      console.log('pathStringClientProject exists: 158');
    } else {
      fs.mkdirSync(pathStringClientProject);
      console.log('pathStringClientProject created: 161');
    }

    if (fs.existsSync(pathStringClientProjectArchived)) {
        console.log('pathStringClientProject exists: 158');
      } else {
        fs.mkdirSync(pathStringClientProjectArchived);
        console.log('pathStringClientProject created: 161');
      }

    for (let projectSpec in projectSpecs) {
      if (projectSpec == 'files') {
        projectSpecs[projectSpec].forEach((file) => {
          console.log(file, ' :167');
          fs.copyFileSync(file.path, path.join(pathStringClientProject + '\\' + file.name + '.' + file.type));
          fs.copyFileSync(file.path, path.join(pathStringClientProjectArchived + '\\' + file.name + '.' + file.type));
        })
      //console.log(projectSpecs[projectSpec]);
      }
    }
  }
});

ipcMain.on('write-to-file', (event, data, fileName, specifiedDriveLetter) => {
  const pathString = path.join(specifiedDriveLetter + '\\waterjetData_testDir\\' + fileName + '.json');

  if (fs.existsSync(path.join(specifiedDriveLetter + '\\waterjetData_testDir\\'))) {
    fs.writeFileSync(pathString, data, {'flag':'a'},  function(err) {
      if (err) {
          return console.error(err);
      }
    });

    event.sender.send('file-written-to', data, fileName)
    console.log('file written to');
  } else {
    console.log('no exist - writeToFile');
  }
});

chokidar.watch('X:/waterjetData/pendingOrder.txt').on('all', (event, path) => {
  console.log(event, path);
  //emitFileChange();
  ipcMain.emit('watch-file');
});


//Use chokidar from top of page!
ipcMain.on('watch-file', (event) => {
  console.log('moved');
});

ipcMain.on('open-file-in-application', (event, projectPath, specifiedDriveLetter) => {
  const editorPath = "C:\\Program Files (x86)\\OMAX Corporation\\OMAX_LAYOUT_and_MAKE\\LAYOUT.exe";

  //shell.openPath(editorPath);
  shell.openPath(projectPath);
});

ipcMain.on('database-interaction', (event, interaction, intendedQuery, projectData) => {

  console.log(interaction + ' outside!');
  console.log(projectData);
  
  const dbConnect = async (interaction) => {
    try {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
      host: '192.168.0.188',
      user: 'user1',
      password: '5nXSzVueHA1v2zMT',
      database: 'waterjetDashboard_testDB',
    });

    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'SELECT * FROM `projects` LIMIT 10';

    if (interaction == 'connect') {
        connection.query("SELECT * FROM projects", (err, data) => {
          if (err) throw(err)
          console.log(data);

          event.sender.send('database-interaction-response', data);
        });
      } else if (interaction == 'get') {
        connection.query(intendedQuery, (err, data) => {
          if (err) throw(err)
          console.log(data);

          event.sender.send('database-interaction-response', data);
        });
      } else if (interaction == 'insert') {
        connection.query(intendedQuery, (err, data) => {
          if (err) throw(err)
          console.log(data);
          
          if(data.serverStatus == 2 && data.warningStatus == 0) {
            console.log(intendedQuery);
            event.sender.send('database-interaction-response', 'success!');
          } else {
            event.sender.send('database-interaction-response', data);
          }
        });
      }

    // Close the connection
    connection.end(function(){
        // The connection has been closed
        console.log('db connection closed');
    });

  } catch (err) {
    console.log(err);
  }
}
  
  console.log('in the db area');

  dbConnect(interaction);
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      webSecurity: false,
      //nodeIntegration: true,
      contextIsolation: true, // Required for IPC to work
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.maximize();

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.