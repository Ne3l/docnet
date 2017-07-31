const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;
const path = require('path');
const url = require('url');
const fs = require('fs');
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

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', function() {
        mainWindow.show();
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

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

ipcMain.on('print-to-pdf', (e, args) => {
    let html = args || '';
    html = html.trim();

    if (!html) return;
    let savePath = dialog.showSaveDialog({});
    if (!savePath) return;

    let winPrint = new BrowserWindow({ show: false });

    var file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
    winPrint.loadURL(file);

    winPrint.once('ready-to-show', function() {
        winPrint.webContents.printToPDF({}, (err, data) => {
            if (err) {
                dialog.showErrorBox('Error', err);
                return;
            }
            fs.writeFile(savePath, data, err => {
                if (err) {
                    dialog.showErrorBox('Error', err);
                    return;
                }
            });
        });
    });
});
