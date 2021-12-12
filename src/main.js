const { app, Menu, BrowserWindow, ipcMain } = require('electron');
const { download } = require("electron-dl");

const path = require('path');
const url = require('url');
const appMenuTemplate = require('./menu/app_menu_template');
const editMenuTemplate = require('./menu/edit_menu_template');
const devMenuTemplate = require('./menu/dev_menu_template');
const createMnemonicWindow = require('./helpers/window');
const initFileIpc = require('./helpers/fileIpc');

// 获取在 package.json 中的命令脚本传入的参数, 来判断是开发还是生产环境
const mode = process.argv[2];

function createWindow() {
  // const mainWindow = new BrowserWindow({
  //   width: 1200,
  //   height: 800,
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'),
  //     nodeIntegration: true,
  //     enableRemoteModule: true,
  //     contextIsolation: false,
  //   }
  // });

  const mainWindow = createMnemonicWindow("main", {
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webSecurity: false,
    }
  });

  if (mode == 'dev') {
    mainWindow.loadURL("http://localhost:3000/");
    // F12 模式
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  ipcMain.on("download", (event, arg) => {
    arg.properties.onProgress = (status) => {
      mainWindow.webContents.send("download-progress", { ...status, uuid: arg.uuid });
    };

    download(BrowserWindow.getFocusedWindow(), arg.url, arg.properties).then((dl) => {
      mainWindow.webContents.send("download-complete", { uuid: arg.uuid, filename: arg.filename });
    });

  });

}

const setApplicationMenu = () => {
  const menus = [appMenuTemplate, editMenuTemplate];
  if (mode == 'dev') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.commandLine.appendSwitch('ignore-certificate-errors');
app.whenReady().then(() => {
  setApplicationMenu();
  initFileIpc();
  createWindow();

  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})


