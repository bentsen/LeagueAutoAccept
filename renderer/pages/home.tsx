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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ipcRenderer.send("start-bot", {
      champion: champion,
      championBan: championBan,
      spell1: spell1,
      spell2: spell2,
    });
  };

  return (
    <>
      <div className="flex justify-center mt-10 flex-col items-center ">
        <h1 className="text-3xl text-white">Leauge Auto Accept</h1>
        <div className="w-2/3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
            <div className="flex justify-center mt-5">
              <button className="w-32 bg-white h-10 rounded-sm">Start</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Home;
