const { contextBridge, ipcRenderer } = require('electron');

// Safe, minimal bridge between the Electron main process and the web app.
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  // Tell main the renderer has finished setting up its listeners.
  ready: () => ipcRenderer.send('renderer-ready'),
  // A file was opened (via association / dialog / drag onto the app icon).
  onOpenFile: (cb) => ipcRenderer.on('open-file', (_e, data) => cb(data)),
  // Native menu items forward actions to the renderer.
  onMenuAction: (cb) => ipcRenderer.on('menu-action', (_e, action) => cb(action)),
  // Save current content to disk via a native dialog.
  saveFile: (opts) => ipcRenderer.invoke('save-file', opts),
});
