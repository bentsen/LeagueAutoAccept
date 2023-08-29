import React, { useContext } from "react";
import Input, { ILeague } from "../components/Input/Input";
import { ChampionContext } from "../data/ChampionContext";
import { SummonerSpellContext } from "../data/SummonerSpellContext";
import electron from "electron";

const ipcRenderer = electron.ipcRenderer;

function Home() {
  const champions = useContext(ChampionContext);
  const spells = useContext(SummonerSpellContext);
  const [champion, setChampion] = React.useState<string[]>(["None", "0"]);
  const [championBan, setChampionBan] = React.useState<string[]>(["None", "0"]);
  const [spell1, setSpell1] = React.useState<string[]>(["None", "0"]);
  const [spell2, setSpell2] = React.useState<string[]>(["None", "0"]);
  const [botActive, setBotActive] = React.useState<boolean>(false);
  const [logs, setLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    ipcRenderer.on("send-log", (event, data) => {
      const finalLog = `${new Date(Date.now()).getHours()}:${new Date(
        Date.now()
      ).getMinutes()} - ${data}`;

      const existingLog = logs.find((log) => {
        const logText = log.split("-")[1].trim(); //this hole useeffect is shit
        return logText === data;
      });
      if (!existingLog) {
        setLogs((logs) => [...logs, finalLog]);
      }
    });
  }, []);

  const handleBotStart = () => {
    setBotActive(true);
    ipcRenderer.send("start-bot", {
      champion: champion,
      championBan: championBan,
      spell1: spell1,
      spell2: spell2,
    });
  };

  const handleBotStop = () => {
    setBotActive(false);
    ipcRenderer.send("start-stop");
  };

  return (
    <>
      <div className="flex mt-10 flex-col">
        <h1 className="text-3xl text-white font-semibold pl-10">
          Leauge Auto Accept
        </h1>
        <div className="w-full">
          <div className="flex flex-row justify-between w-full h-full px-10">
            <div className="w-72 mt-5 flex flex-col gap-1">
              <Input
                selected={champion}
                setSelected={setChampion}
                content={champions.map((champ) => ({
                  key: champ.key,
                  name: champ.name,
                  image: champ.image.sprite,
                }))}
                label="Champion"
              />
              <Input
                selected={championBan}
                setSelected={setChampionBan}
                content={champions.map((champ) => ({
                  key: champ.key,
                  name: champ.name,
                  image: champ.image.sprite,
                }))}
                label="Champion Ban"
              />
              <Input
                selected={spell1}
                setSelected={setSpell1}
                content={spells.map((spell) => ({
                  key: spell.key,
                  name: spell.name,
                  image: spell.image.full,
                }))}
                label="Summoner Spell 1"
              />
              <Input
                selected={spell2}
                setSelected={setSpell2}
                content={spells.map((spell) => ({
                  key: spell.key,
                  name: spell.name,
                  image: spell.image.full,
                }))}
                label="Summoner Spell 2"
              />
              <div className="flex justify-center mt-5 items-end">
                <button
                  type="button"
                  onClick={botActive ? handleBotStop : handleBotStart}
                  className="w-32 bg-white h-10 rounded-sm"
                >
                  {botActive ? "Stop" : "Start"}
                </button>
              </div>
            </div>
            <div className="min-h-full flex flex-col  w-[500px] mt-5">
              <span className="text-white text-2xl font-semibold">Status</span>
              <div className="bg-gray-100/80 border-4 border-gray-300 w-full h-72">
                <textarea
                  value={logs.join("\n")}
                  className="min-w-full min-h-full bg-transparent px-1 resize-none"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
