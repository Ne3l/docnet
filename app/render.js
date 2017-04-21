const { shell } = require('electron');
const autoUpdater = require('electron').remote.require('electron-updater').autoUpdater;
const remote = require('electron').remote;
const Menu = remote.Menu;
autoUpdater.addListener('update-available', function(event) {
    console.log('A new update is available');
    var element = document.getElementById('docnet');
    element.outerHTML = '';
    paintSpinner('Descargando Actualización');
});
autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    console.log(
        'A new update is ready to install',
        `Version ${releaseName} is downloaded and will be automatically installed on Quit`
    );
    autoUpdater.quitAndInstall();
    return true;
});
autoUpdater.addListener('error', error => {
    console.log(error);
});
autoUpdater.checkForUpdates();

const webview = document.getElementById('docnet');
const loading = document.getElementById('loading');

webview.style.height = window.innerHeight + 'px';
window.onresize = function(event) {
    webview.style.height = window.innerHeight + 'px';
};

function paintSpinner(label) {
    let spinner = '<div class="ms-spinner">';
    spinner += '<div class="ms-spinner-circle"></div>';
    spinner += '<div class="ms-spinner-label">';
    spinner += '<span>' + label + '</span>';
    spinner += '</div>';
    spinner += '</div>';
    loading.innerHTML = spinner;
}

function login() {
    var functionClick = 'function(e){';
    functionClick += " if($('#recordarCredentials').prop('checked')){";
    functionClick += "localStorage.setItem('user',$('#inputUsuario').val());";
    functionClick += "localStorage.setItem('password',$('#inputPassword').val());";
    functionClick += '}}';

    var mainFunction = "if($('body').hasClass('login')){";
    mainFunction +=
        '$(\'#frmLogin\').append(\'<input type="checkbox" id="recordarCredentials" checked/> <span style="color:#fff;"> Recordar usuario y contraseña</span>\');';
    mainFunction += "$('#inputUsuario').val(localStorage.getItem('user'));";
    mainFunction += "$('#inputPassword').val(localStorage.getItem('password'));";
    mainFunction += "$('#btnAceptar').on('click'," + functionClick + ')';
    mainFunction += '}';
    webview.executeJavaScript(mainFunction);
}

onload = () => {
    var showSpinner = true;
    const loadstart = () => {
        if (showSpinner) {
            paintSpinner('Cargando');
        }
    };
    const loadstop = () => {
        if (showSpinner) {
            showSpinner = false;
            loading.innerHTML = '';
        }
        webview.insertCSS(
            '::-webkit-scrollbar {background-color: #eee ;width: 0.8em} ::-webkit-scrollbar-thumb:window-inactive, ::-webkit-scrollbar-thumb {background: #48525e ;}'
        );
        login();
    };
    webview.addEventListener('did-start-loading', loadstart);
    webview.addEventListener('did-stop-loading', loadstop);
};

webview.addEventListener('new-window', function(event) {
    shell.openExternal(event.url);
});

webview.addEventListener('context-menu', (e, props) => {
    const menu = Menu.buildFromTemplate([
        ,
        {
            label: 'Copiar',
            role: 'copy'
        },
        {
            label: 'Pegar',
            role: 'paste'
        },
        {
            type: 'separator'
        },
        {
            label: 'Seleccionar Todo',
            role: 'selectall'
        }
    ]);
    menu.popup(remote.getCurrentWindow());
});
