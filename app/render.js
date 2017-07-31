const { shell, remote, ipcRenderer } = require('electron');
const { Menu, app } = remote;

const webview = document.getElementById('docnet');
const loading = document.getElementById('loading');

webview.style.height = window.innerHeight + 'px';
window.onresize = function(event) {
    webview.style.height = window.innerHeight + 'px';
};

function paintSpinner(label) {
    let spinner = `<div class="ms-spinner">
        <div class="ms-spinner-circle"></div>
        <div class="ms-spinner-label">
            <span>${label}</span>
        </div>
    </div>`;
    loading.innerHTML = spinner;
}

function login() {
    var functionClick = function(e) {
        if ($('#recordarCredentials').prop('checked')) {
            localStorage.setItem('user', $('#inputUsuario').val());
            localStorage.setItem('password', $('#inputPassword').val());
        }
    };

    var mainFunction = `$('#frmLogin').append('<input type="checkbox" id="recordarCredentials" checked/> <span style="color:#fff;"> Recordar usuario y contraseña</span>');
    $('#inputUsuario').val(localStorage.getItem('user'));
    $('#inputPassword').val(localStorage.getItem('password'));
    $('#btnAceptar').on('click',${functionClick.toString()});`;
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
        if (webview.src.indexOf('login.aspx') !== 1) {
            login();
        }
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

ipcRenderer.on('update-available', function(event, text) {
    let element = document.getElementById('docnet');
    element.outerHTML = '';
    paintSpinner('Descargando Actualización');
});
