const { app, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const PDFWindow = require('electron-pdf-window');

const joinAndMkdir = (arg, isFile=false) => {
  let dir = path.join(app.getAppPath(), '..');
  if (!isFile) {
    for (let i = 0; i < arg.length; i++) {
      dir = path.join(dir, arg[i]);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
  } else {
    for (let i = 0; i < arg.length-1; i++) {
      dir = path.join(dir, arg[i]);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
    dir = path.join(dir, arg[arg.length-1]);
  }
  
  return dir;
}

const initFileIpc = () => {
  
    ipcMain.on("get-app-path", (event, arg) => {
      event.reply("app-path", app.getAppPath());
    });

    ipcMain.on("sync-get-app-path", (event, arg) => {
      event.returnValue = app.getAppPath();
    });

    ipcMain.on("open-path", (event, arg) => {
      let dir = joinAndMkdir(arg);
      shell.openPath(dir);
    });

    ipcMain.on("open-pdf", (event, arg) => {
      let dir = joinAndMkdir(arg, true);
      const win = new PDFWindow({
        width: 800,
        height: 600
      });
      win.loadURL(dir);
    })

    ipcMain.on("open-external-link", (event, href) => {
      shell.openExternal(href);
    });
};

module.exports = initFileIpc;