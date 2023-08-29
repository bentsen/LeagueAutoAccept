import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { runBot } from "./bot";

const isProd: boolean = process.env.NODE_ENV === "production";
if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 595,
    resizable: false,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  app.on("window-all-closed", () => {
    app.quit();
  });

  type IData = {
    champion: string[];
    championBan: string[];
    spell1: string[];
    spell2: string[];
  };

  ipcMain.on("start-bot", (event, args: IData) => {
    (async () => {
      runBot({ args, mainWindow });
    })();
  });

  ipcMain.on("stop-bot", () => {
    console.log("stop bot");
  });
})();
