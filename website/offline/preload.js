const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("getDirname", () => ipcRenderer.invoke("getDirname"));
contextBridge.exposeInMainWorld("pathJoin", (...args) => ipcRenderer.invoke("pathJoin", ...args));