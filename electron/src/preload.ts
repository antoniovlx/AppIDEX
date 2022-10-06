require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
console.log('User Preload!');

const { contextBridge, ipcRenderer } = require('electron');

///////Do Not Edit////////
//require("./node_modules/@capacitor-community/electron/dist/electron-bridge.js");
/////////////////////////

contextBridge.exposeInMainWorld('electron', {
  ipc: { ...ipcRenderer }
})