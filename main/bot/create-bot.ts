import { Hardware, type WindowInfo, sleep } from "keysender";
import { LCU } from "../LCU";

let pickedChamp: boolean = false;
let lockedChamp: boolean = false;
let pickedBan: boolean = false;
let lockedBan: boolean = false;
let pickedSpell1: boolean = false;
let pickedSpell2: boolean = false;
let sentChatMessages: boolean = false;

let lastActStartTime: number;
let champSelectStart: number;
let lastActId: number;
let lastChatRoom: string = "";

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

    async handleChampSelect() {
      LCU()
        .getLeagueAuth()
        .then(async (leagueAuth: string[]) => {
          if (leagueAuth[1]) {
            const currentChampSelect: string[] = await LCU().clientRequest(
              "GET",
              "lol-champ-select/v1/session",
              leagueAuth
            );
            console.log(currentChampSelect);
          }
        });
    },

    async showCurrentUser() {
      LCU()
        .getLeagueAuth()
        .then(async (leagueAuth: string[]) => {
          if (leagueAuth[1]) {
            const currentUser: string[] = await LCU().clientRequest(
              "GET",
              "/lol-summoner/v1/current-summoner",
              leagueAuth
            );
            console.log("user: ", currentUser);
          }
        });
    },
  };
};
