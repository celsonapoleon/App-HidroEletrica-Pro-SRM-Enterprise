const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: "HidroElétrica Pro — SRM Enterprise",
    backgroundColor: '#0f172a', // Cor Slate-950 para evitar "flash branco" no load
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Para segurança de dados
    },
    icon: path.join(__dirname, 'assets/icon.ico')
  });

  // Em desenvolvimento, aponta para o servidor local do Expo/React
  // Em produção, carregaria o arquivo index.html da pasta build
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, './web-build/index.html')}`;
  win.loadURL(startUrl);

  // Remove a barra de menus padrão para visual mais limpo (Enterprise)
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
