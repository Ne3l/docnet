const {shell} = require('electron')
const autoUpdater = require('electron').remote.require('electron-auto-updater').autoUpdater;

autoUpdater.addListener("update-available", function (event) {
    console.log("A new update is available");
    var element = document.getElementById("docnet");
    element.outerHTML = "";
    delete element;
    paintSpinner("Descargando Actualización");
});
autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    console.log("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
    autoUpdater.quitAndInstall();
    return true;
})
autoUpdater.addListener("error", (error) => {
    console.log(error);
});
autoUpdater.checkForUpdates();

const webview = document.getElementById("docnet");
const loading = document.getElementById('loading')
   
webview.style.height = window.innerHeight + "px";
window.onresize = function (event) {
    webview.style.height = window.innerHeight + "px";
};

function paintSpinner(label){
    let spinner = '<div class="ms-spinner">';
            spinner += '<div class="ms-spinner-circle"></div>';
            spinner += '<div class="ms-spinner-label">';
            spinner += '<span>' + label + '</span>';
            spinner += '</div>';
            spinner += '</div>';
            loading.innerHTML = spinner;
}

onload = () => {
    var showSpinner = true;
    const loadstart = () => {
        if (showSpinner) {
           paintSpinner("Cargando"); 
        }
    }
    const loadstop = () => {
        if (showSpinner) {
            showSpinner = false;
            loading.innerHTML = '';
        }
        webview.insertCSS('::-webkit-scrollbar {background-color: #eee ;width: 0.8em} ::-webkit-scrollbar-thumb:window-inactive, ::-webkit-scrollbar-thumb {background: #48525e ;}');
    }
    webview.addEventListener('did-start-loading', loadstart)
    webview.addEventListener('did-stop-loading', loadstop)
}

webview.addEventListener('new-window', function (event) {
    shell.openExternal(event.url);
});