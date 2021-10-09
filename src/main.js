const {app, Menu, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const appMenuTemplate = require('./menu/app_menu_template');
const editMenuTemplate = require('./menu/edit_menu_template');
const devMenuTemplate = require('./menu/dev_menu_template');
const createMnemonicWindow = require('./helpers/window');

// 获取在 package.json 中的命令脚本传入的参数, 来判断是开发还是生产环境
const mode = process.argv[2];

function createWindow () {
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
  
}

const setApplicationMenu = () => {
  const menus = [appMenuTemplate, editMenuTemplate];
  if (mode == 'dev') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.whenReady().then(() => {
  setApplicationMenu();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } 
  });
})


