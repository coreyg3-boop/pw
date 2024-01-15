// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getFile: (fileName, specifiedDriveLetter) => ipcRenderer.send('get-file', fileName, specifiedDriveLetter),
    onFileResponse: (func) => ipcRenderer.on('get-file-response', (event, data, fileName) => func(data, fileName)),
    createOrRelocateDirectory: (action, projectSpecs, specifiedDriveLetter) => ipcRenderer.send('create-or-relocate-directory', action, projectSpecs, specifiedDriveLetter),
    writeToFile: (data, fileName, specifiedDriveLetter) => ipcRenderer.send('write-to-file', data, fileName, specifiedDriveLetter),
    onWriteToFileResponse: (func) => ipcRenderer.on('file-written-to', (event, data, fileName) => func(data, fileName)),
    watchFile: (fileName, specifiedDriveLetter) => ipcRenderer.send('watch-file', fileName, specifiedDriveLetter),
    dbInteraction: (interaction, intendedQuery, projectData) => ipcRenderer.send('database-interaction', interaction, intendedQuery, projectData),
    dbInteractionResponse: (func) => ipcRenderer.on('database-interaction-response', (event, data) => func(data)),
    onFileChange: (func) => ipcRenderer.on('file-changed', (event, path) => func(path)),
    openFileInApplication: (projectPath, specifiedDriveLetter) => ipcRenderer.send('open-file-in-application', projectPath, specifiedDriveLetter)
});