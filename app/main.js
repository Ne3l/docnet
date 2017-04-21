const electron = require('electron');
var { app, BrowserWindow, ipcMain } = electron;
const autoUpdater = require('electron-updater').autoUpdater;
const path = require('path');
const url = require('url');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Docnet',
        backgroundColor: '#2c363f',
        show: false
    });
    mainWindow.maximize();
    mainWindow.setMenu(null);

    mainWindow.webContents.openDevTools();

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.once('ready-to-show', function() {
        mainWindow.show();
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

ipcMain.on('did-finish-load', function() {
    autoUpdater.checkForUpdates();
});

autoUpdater.addListener('update-available', function(event) {
    mainWindow.webContents.send('update-available');
});
autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    autoUpdater.quitAndInstall();
    return true;
});
autoUpdater.addListener('error', error => {
    console.log(error);
});

app.on('ready', createWindow);
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});
