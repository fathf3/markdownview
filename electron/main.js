const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const FILE_RE = /\.(md|markdown|mdown|mkd|mkdn|txt)$/i;

let mainWindow = null;
let rendererReady = false;
let pendingFile = null; // { path, content } waiting for the renderer

// ---------- helpers ----------
function findFileArg(argv) {
  // argv[0] is the executable; scan the rest for a markdown file path.
  for (const a of argv.slice(1)) {
    if (!a || a.startsWith('-')) continue;
    if (FILE_RE.test(a) && fs.existsSync(a)) return path.resolve(a);
  }
  return null;
}

function readFile(p) {
  try {
    return { path: p, content: fs.readFileSync(p, 'utf8') };
  } catch {
    return null;
  }
}

function deliverFile(fileObj) {
  if (!fileObj) return;
  if (rendererReady && mainWindow) {
    mainWindow.webContents.send('open-file', fileObj);
    pendingFile = null;
  } else {
    pendingFile = fileObj; // send once the renderer signals ready
  }
}

// Resolve the brand icon across dev (build/, public/) and packaged (dist/) layouts.
function appIcon() {
  const candidates = [
    path.join(__dirname, '..', 'build', 'icon.ico'),
    path.join(__dirname, '..', 'dist', 'icon-512.png'),
    path.join(__dirname, '..', 'public', 'icon-512.png'),
  ];
  return candidates.find((p) => fs.existsSync(p));
}

// ---------- window + menu ----------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 600,
    minHeight: 400,
    backgroundColor: '#0d1117',
    icon: appIcon(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  buildMenu();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function buildMenu() {
  const send = (action) =>
    mainWindow && mainWindow.webContents.send('menu-action', action);

  const template = [
    {
      label: 'Dosya',
      submenu: [
        { label: 'Aç…', accelerator: 'CmdOrCtrl+O', click: openDialog },
        { label: 'Kaydet', accelerator: 'CmdOrCtrl+S', click: () => send('save') },
        { type: 'separator' },
        { label: 'HTML olarak dışa aktar', click: () => send('export-html') },
        {
          label: 'PDF olarak dışa aktar',
          accelerator: 'CmdOrCtrl+P',
          click: () => send('export-pdf'),
        },
        { type: 'separator' },
        { role: 'quit', label: 'Çıkış' },
      ],
    },
    {
      label: 'Düzen',
      submenu: [
        { role: 'undo', label: 'Geri Al' },
        { role: 'redo', label: 'Yinele' },
        { type: 'separator' },
        { role: 'cut', label: 'Kes' },
        { role: 'copy', label: 'Kopyala' },
        { role: 'paste', label: 'Yapıştır' },
        { role: 'selectAll', label: 'Tümünü Seç' },
      ],
    },
    {
      label: 'Görünüm',
      submenu: [
        {
          label: 'Temayı Değiştir',
          accelerator: 'CmdOrCtrl+J',
          click: () => send('toggle-theme'),
        },
        { type: 'separator' },
        { role: 'reload', label: 'Yenile' },
        { role: 'toggleDevTools', label: 'Geliştirici Araçları' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Yakınlaştırmayı Sıfırla' },
        { role: 'zoomIn', label: 'Yakınlaştır' },
        { role: 'zoomOut', label: 'Uzaklaştır' },
        { role: 'togglefullscreen', label: 'Tam Ekran' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function openDialog() {
  if (!mainWindow) return;
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'mkd', 'txt'] },
      { name: 'Tüm Dosyalar', extensions: ['*'] },
    ],
  });
  if (!canceled && filePaths[0]) deliverFile(readFile(filePaths[0]));
}

// ---------- ipc ----------
ipcMain.handle('save-file', async (_e, { content, suggestedName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: suggestedName || 'belge.md',
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
  });
  if (canceled || !filePath) return { canceled: true };
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { path: filePath };
  } catch (err) {
    return { error: String(err) };
  }
});

ipcMain.on('renderer-ready', () => {
  rendererReady = true;
  if (pendingFile) deliverFile(pendingFile);
});

// ---------- single instance + lifecycle ----------
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  // A second launch (e.g. double-clicking another .md) routes here.
  app.on('second-instance', (_e, argv) => {
    const f = findFileArg(argv);
    if (f) deliverFile(readFile(f));
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // macOS: file association / drop on dock icon.
  app.on('open-file', (e, p) => {
    e.preventDefault();
    deliverFile(readFile(p));
  });

  app.whenReady().then(() => {
    const initial = findFileArg(process.argv);
    if (initial) pendingFile = readFile(initial);
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
