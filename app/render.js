const {shell} = require('electron')
const app = require('electron').remote.app;
const updater = require('electron').remote.require('electron-auto-updater');

console.log("current versiones: " + app.getVersion());
console.log(app);

updater.autoUpdater.checkForUpdates();
updater.autoUpdater.addListener("update-available", function (event) {
    console.log("A new update is available");
});

updater.autoUpdater.addListener("update-not-available", function () {
    console.log("update-not-available");
});

updater.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    console.log("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
    console.log("quitAndInstall");
    updater.autoUpdater.quitAndInstall();
    return true;
})
updater.autoUpdater.addListener("error", (error) => {
    console.log(error);
});
updater.autoUpdater.addListener("checking-for-update", (event) => {
    console.log("checking-for-update");
});



var webview = document.getElementById("docnet");
webview.style.height = window.innerHeight + "px";
window.onresize = function (event) {
    webview.style.height = window.innerHeight + "px";
};
onload = () => {
    const loading = document.getElementById('loading')
    var showSpinner = true;
    const loadstart = () => {
        if (showSpinner) {
            let spinner = '<div class="ms-spinner">';
            spinner += '<div class="ms-spinner-circle"/>';
            spinner += '</div>';
            loading.innerHTML = spinner;
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
