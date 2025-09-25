import { app, BrowserWindow, ipcMain } from 'electron/main'; //, Menu
// const { mainMenu } = require("./menu");
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		// fullscreen: true,
		icon: path.join(__dirname, 'icon.png'),
		// autoHideMenuBar: true
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	win.loadFile('index.html');
	win.removeMenu();
	win.maximize();
	// The line below opens the dev tools
	if (!app.isPackaged) win.webContents.openDevTools();
}

// Menu.setApplicationMenu(mainMenu);
// Menu.setApplicationMenu(null);

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// ipcMain.handle("getDirname", () => path.dirname(process.execPath));
ipcMain.handle("getDirname", () => app.isPackaged ? path.dirname(process.execPath) : app.getAppPath());
ipcMain.handle("pathJoin", (event, ...args) => path.join(...args));