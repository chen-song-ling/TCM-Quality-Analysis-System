const { app, ipcMain, shell, dialog, BrowserWindow } = require('electron');
const { download } = require("electron-dl");

const path = require('path');
const fs = require('fs');
const PDFWindow = require('electron-pdf-window');
const XLSX = require("xlsx");


// const baseApiUrl = "https://lab.tery.top:8000/static/";
// const baseApiUrl = "http://lab2.tery.top:8000/static/";
// const baseApiUrl = "http://10.249.43.41:8080/static/";
const baseApiUrl = "http://127.0.0.1:8000/static/";


const joinAndMkdir = (arg, isFile = false) => {
  let dir = path.join(app.getAppPath(), '..');

  if (!isFile) {
    for (let i = 0; i < arg.length; i++) {
      dir = path.join(dir, arg[i]);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
  } else {
    for (let i = 0; i < arg.length - 1; i++) {
      dir = path.join(dir, arg[i]);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }
    dir = path.join(dir, arg[arg.length - 1]);
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

  ipcMain.on("show-item-in-folder", (event, arg) => {
    let dir = joinAndMkdir(arg);
    shell.showItemInFolder(dir);
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

  // 直接利用 url 在线预览文件
  ipcMain.on("view-file-online", (event, arg) => {
    let extname = path.extname(arg);

    if (extname === ".pdf") {

      let win = new PDFWindow({
        width: 800,
        height: 600
      });
      win.loadURL(baseApiUrl + arg);
    } else if ([".png", ".jpg", ".jpeg"].includes(extname)) {

      let win = new BrowserWindow({
        height: 800,
        width: 600
      });
      win.loadURL(baseApiUrl + arg);
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
        { name: "CSV UTF-8 (逗号分隔)", extensions: ["csv"] },
      ],
      nameFieldLabel: "存储为",
      showsTagField: true,
    });

    if (res === undefined) {
      return;
    }
    let file = path.resolve(res);
    fs.writeFile(file, csv, { encoding: 'utf8' }, err => { });

  });

  ipcMain.on("save-chrom-xlsx-with-dialog", (event, arg) => {
    let xlsx = arg.xlsx;
    let csv = arg.csv;

    var workbook = XLSX.utils.book_new();
    workbook.SheetNames.push("Sheet1");
    var worksheet = XLSX.utils.aoa_to_sheet(xlsx);
    workbook.Sheets["Sheet1"] = worksheet;

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
        { name: "Excel 工作簿", extensions: ["xlsx"] },
        { name: "CSV UTF-8 (逗号分隔)", extensions: ["csv"] },
      ],
      nameFieldLabel: "存储为",
      showsTagField: true,
    });

    if (res === undefined) {
      return;
    }
    let filePath = path.resolve(res);
    let index= filePath.lastIndexOf(".");
    let ext = filePath.substr(index+1);
    if (ext === "csv") {
      fs.writeFile(filePath, csv, { encoding: 'utf8' }, err => { });
    } else {
      XLSX.writeFile(workbook, filePath);
    }
    
  });

  ipcMain.on("sync-open-save-dialog", (event, arg) => {

    let defaultFileName = "未命名";
    if (arg !== null && arg !== undefined) {
      if (arg.defaultFileName !== undefined) {
        defaultFileName = arg.defaultFileName;
      }
    }

    const res = dialog.showSaveDialogSync({
      title: "选择保持路径",
      defaultPath: defaultFileName,
      buttonLabel: "储存",
      nameFieldLabel: "存储为",
      showsTagField: true,
    });

    event.returnValue = res;
  });

  // ipcMain.on("download", (event, arg) => {
  //   arg.properties.onProgress = (status) => {
  //     // window.webContents.send("download progress", status)
  //   };

  //   download(BrowserWindow.getFocusedWindow(), arg.url, arg.properties).then((dl) => {
  //     // window.webContents.send("download complete", dl.getSavePath())
  //   });
  // });

  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });


};

module.exports = initFileIpc;