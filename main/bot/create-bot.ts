import { Hardware, type WindowInfo, sleep } from "keysender";
import { LCU } from "../LCU";

export default (win: WindowInfo) => {
  const { keyboard, mouse, workwindow } = new Hardware(win.handle);
  sleep(250);

  return {
    async PickSummonerSpells({
      spell1,
      spell2,
    }: {
      spell1: { x: number; y: number; name: string };
      spell2: { x: number; y: number; name: string };
    }) {
      console.log("picking ", spell1.name);
      await mouse.humanMoveTo(700, 678, 250);
      mouse.click("left");
      await sleep(1000);
      await mouse.humanMoveTo(Number(spell1.x), Number(spell1.y), 250);
      mouse.click("left");
      await sleep(1000);

      console.log("picking ", spell2.name);
      await mouse.humanMoveTo(750, 676, 250);
      mouse.click("left");
      await sleep(1000);
      await mouse.humanMoveTo(Number(spell2.x), Number(spell2.y), 250);
      mouse.click("left");
      await sleep(1000);
    },

    async pickChampion(name) {
      //Move mouse to champion search input and search champion name
      await mouse.humanMoveTo(760, 103, 250);
      mouse.click("left");
      await sleep(1000);
      keyboard.printText(name);

      await sleep(1000);

      //move mouse to champion and lock in
      await mouse.humanMoveTo(393, 163, 250);
      mouse.click("left");
      await sleep(1000);
      await mouse.humanMoveTo(637, 606, 250);
      mouse.click("left");
    },

    async acceptQueue() {
      while (true) {
        if (workwindow.colorAt(586, 549) === "1e252a") {
          console.log("queue pop");
          await mouse.humanMoveTo(586, 546, 250);
          mouse.click("left");
          return;
        }
      }
    },

    async gameSession() {
      const gameSession: string[] = await LCU().clientRequest(
        "GET",
        "/lol-gameflow/v1/session"
      );
      return gameSession;
    },

    async showCurrentUser() {
      const currentUser: string[] = await LCU().clientRequest(
        "GET",
        "/lol-summoner/v1/current-summoner"
      );
      console.log("user: ", currentUser);
    },
  };
};
