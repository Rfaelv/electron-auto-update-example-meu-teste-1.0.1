const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const process = require('process')

const data = process.argv

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "assets/icon.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('data', (event) => {
  event.sender.send('data', data);
});

const fs = require('fs')
const dt = {a:"funcionou"}
// fs.writeFileSync('arquivo.buck', JSON.stringify(dt));
fs.readFile('arquivo.buck', (err, d) => {
  if (err) throw err;
  console.log(JSON.parse(d).a);
});