const { app, ipcMain, shell, dialog } = require('electron');
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
      let win = new PDFWindow({
        width: 800,
        height: 600
      });
      if (fs.existsSync(dir)) {
        win.loadURL(dir);
      }
      
    });

    ipcMain.on("open-file", (event, arg) => {
      let dir = joinAndMkdir(arg, true);
      if (!fs.existsSync(dir)) {
        return;
      }

      let extname = path.extname(dir);
      if (extname === ".pdf") {
        let win = new PDFWindow({
          width: 800,
          height: 600
        });
        win.loadURL(dir);
      }
      
    });

    ipcMain.on("get-file-list", (event, arg) => {
      let dir = joinAndMkdir(arg);
      fs.readdir(dir, (err, files) => {
        event.reply("file-list", files);
      })
    });

    ipcMain.on("save-chrom-csv-with-dialog", (event, arg) => {
      let csv = arg.csv;
      let defaultFileName = arg.defaultFileName;
      let dotIdx = defaultFileName.lastIndexOf(".");
      if (dotIdx !== -1) {
          defaultFileName = defaultFileName.substring(0, dotIdx);
      }

      const res = dialog.showSaveDialogSync({
          title: "保存标记结果",
          defaultPath: defaultFileName,
          buttonLabel: "储存",
          filters: [
              { name: "CSV UTF-8 (逗号分隔)", extensions: ["csv"]},
          ],
          nameFieldLabel: "存储为",
          showsTagField: true,
      });

      if (res === undefined) {
        return;
      }
      let file = path.resolve(res);
      fs.writeFile(file, csv, { encoding: 'utf8' }, err => {});

    });

    

    ipcMain.on("open-external-link", (event, href) => {
      shell.openExternal(href);
    });
};

module.exports = initFileIpc;