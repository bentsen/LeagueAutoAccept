import electron from "electron";
import { createGame } from "../game";
import { createBot, summonerSpellPos } from "../bot";
import { sleep } from "keysender";
import { LCU } from "../LCU";

const ipcRenderer = electron.ipcRenderer;

type IData = {
  champion: string;
  championBan: string;
  spell1: string;
  spell2: string;
};

export default async ({ args }: { args: IData }) => {
  console.log("trying to find league of legends");

  const win = createGame({ name: "League of Legends" });

  if (!win) {
    console.log("Was not able to find league og legends");
    ipcRenderer.send("stop-bot");
  } else {
    console.log("League of Legends was found creating bot");
    const {
      pickChampion,
      PickSummonerSpells,
      acceptQueue,
      showCurrentUser,
      handleChampSelect,
    } = createBot(win);

    console.log("Data");
    console.log(args);

    handleChampSelect();

    /* 
    console.log("waiting for queue");
    await acceptQueue();

    console.log("Waiting for banning phase");

    
    console.log("Picking Summoner Spells");
    const spell1_Position = summonerSpellPos(args.spell1);
    const spell2_position = summonerSpellPos(args.spell2);
    await PickSummonerSpells({
      spell1: spell1_Position,
      spell2: spell2_position,
    });

    await sleep(2000);

    console.log("picking champion");
    await pickChampion(args.champion);
    */
  }
};
