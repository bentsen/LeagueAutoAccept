import { LCU } from "../LCU";
import { GameFlowSession } from "../../renderer/utils/@types/LCU/lol-gameflow/session";
import { ChampSelectSession } from "../../renderer/utils/@types/LCU/lol-champ-select/session";
import { BrowserWindow } from "electron";

type IData = {
  champion: string[];
  championBan: string[];
  spell1: string[];
  spell2: string[];
};

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

export default async ({
  args,
  mainWindow,
}: {
  args: IData;
  mainWindow: BrowserWindow;
}) => {
  while (true) {
    const gameSession: {
      status: string;
      response: GameFlowSession;
    } = await LCU().clientRequest("GET", "lol-gameflow/v1/session");

    if (gameSession.status === "200") {
      const phase: string = gameSession.response.phase;

      switch (phase) {
        case "Lobby":
          mainWindow.webContents.send("send-log", "In lobby");
          await sleep(5000);
          break;
        case "Matchmaking":
          mainWindow.webContents.send("send-log", "In matchmaking");
          await sleep(2000);
          break;
        case "ReadyCheck":
          mainWindow.webContents.send("send-log", "Ready check");
          LCU().clientRequest("POST", "lol-matchmaking/v1/ready-check/accept");
          break;
        case "ChampSelect":
          mainWindow.webContents.send("send-log", "In ChampionSelect");
          handleChampSelect(args);
          break;
        case "InProgress":
          mainWindow.webContents.send("send-log", "Inside Game");
          await sleep(9000);
          break;
        case "WaitingForStats":
          mainWindow.webContents.send("send-log", "waiting for stats");
          await sleep(9000);
          break;
        case "PreEndOfGame":
          mainWindow.webContents.send("send-log", "In honorscreen");
          await sleep(9000);
          break;
        case "EndOfGame":
          mainWindow.webContents.send("send-log", "In statscreen");
          await sleep(5000);
          break;
        default:
          console.log("default");
          await sleep(1000);
          break;
      }
      await sleep(50);
    } else {
      console.log("sleep a little here");
      await sleep(1000);
    }
  }
};

async function handleChampSelect(args: IData) {
  console.log("handleChampSelect running");
  const currentChampSelect: {
    status: string;
    response: ChampSelectSession;
  } = await LCU().clientRequest("GET", "lol-champ-select/v1/session");
  console.log(currentChampSelect.status);
  if (currentChampSelect.status == "200") {
    const localPlayerCellId: number =
      currentChampSelect.response.localPlayerCellId;

    if (!pickedChamp || !lockedChamp || !pickedBan || !lockedBan) {
      handleChampSelectActions(currentChampSelect, localPlayerCellId, args);
    }
    if (!pickedSpell1 || !pickedSpell2) {
      const champSelectActions: { status: string; response: undefined } =
        await LCU().clientRequest(
          "PATCH",
          "lol-champ-select/v1/session/my-selection",
          {
            spell1Id: Number(args.spell1[1]),
            spell2Id: Number(args.spell2[1]),
          }
        );
      console.log("API Response:", champSelectActions);
      console.log(champSelectActions.status);
      if (champSelectActions.status == "204") {
        pickedSpell1 = true;
        pickedSpell2 = true;
      }
    }
  }
}

function handleChampSelectActions(
  currentChampSelect: { status: string; response: ChampSelectSession },
  localPlayerCellId: number,
  args: IData
) {
  console.log("handleChampSelectActions running");
  currentChampSelect.response.actions.forEach((act) => {
    if (
      act[0].actorCellId == localPlayerCellId &&
      act[0].completed == false &&
      act[0].type == "pick"
    ) {
      handlePickAction(
        act[0].id,
        act[0].championId,
        act[0].isInProgress,
        args,
        currentChampSelect
      );
    } else if (
      act[0].actorCellId == localPlayerCellId &&
      act[0].completed == false &&
      act[0].type == "ban"
    ) {
      console.log("hej");
      handleBanAction(
        act[0].id,
        act[0].championId,
        act[0].isInProgress,
        args,
        currentChampSelect
      );
    }
  });
}

function handlePickAction(
  actId: number,
  championId: number,
  ActIsInProgress: boolean,
  args: IData,
  currentChampSelect: { status: string; response: ChampSelectSession }
) {
  console.log("handlePickAction running");
  if (!pickedChamp) {
    //Hover champion when champ select start
    const champSelectPhase: string = currentChampSelect.response.timer.phase;
    const currentTime: number = Date.now();

    if (
      currentTime - 10000 > champSelectStart || // here we check if enough time has passed since the planning phase has started
      champSelectPhase != "PLANNING" // Check if its even planning phase at all
    ) {
      console.log(args.champion[1]);
      hoverChampion(actId, args.champion[1], "pick");
    }
  }

  if (ActIsInProgress == true) {
    markPhaseStart(actId);

    if (!lockedChamp) {
      console.log("jeg picker champion");
      lockChampion(actId, Number(args.champion[1]), "pick");
    }
  }
}

function handleBanAction(
  actId: number,
  championId: number,
  actIsInProgress: boolean,
  args: IData,
  currentChampSelect: { status: string; response: ChampSelectSession }
) {
  const champSelectPhase: string = currentChampSelect.response.timer.phase;
  console.log("handleBanAction running");
  //make sure its my turn to pick and that it is not the planning phase anymore
  if (actIsInProgress == true && champSelectPhase != "PLANNING") {
    markPhaseStart(actId);

    if (!pickedBan) {
      hoverChampion(actId, args.championBan[1], "ban");
    }

    if (!lockedBan) {
      lockChampion(actId, championId, "ban");
    }
  }
}

function markPhaseStart(actId: number) {
  console.log("markPhaseStart running");
  if (actId != lastActId) {
    lastActId = actId;
    lastActStartTime = Date.now();
  }
}

async function hoverChampion(
  actId: number,
  currentChamp: string,
  actType: string
) {
  console.log("hoverChampion running");
  const champSelectAction: { status: string; response: undefined } =
    await LCU().clientRequest(
      "PATCH",
      "lol-champ-select/v1/session/actions/" + actId,
      {
        championId: currentChamp,
      }
    );
  console.log(champSelectAction.status);
  if (champSelectAction.status == "204") {
    if (actType === "pick") {
      pickedChamp = true;
    } else if (actType == "ban") {
      pickedBan = true;
    }
  }
}

async function lockChampion(
  actId: number,
  championId: number,
  actType: string
) {
  console.log("lockChampion running");
  const championSelectAction: { status: string; response: undefined } =
    await LCU().clientRequest(
      "PATCH",
      "lol-champ-select/v1/session/actions/" + actId,
      {
        championId: championId,
        completed: true,
      }
    );
  console.log(actId);
  console.log(championId);
  console.log(championSelectAction.status);
  if (championSelectAction.status == "204") {
    if (actType == "pick") {
      lockedChamp = true;
    } else if (actType == "ban") {
      lockedBan = true;
    }
  }
}

function sleep(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
