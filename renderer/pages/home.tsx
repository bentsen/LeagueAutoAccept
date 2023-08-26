import React, { useContext } from "react";
import Input, { ILeague } from "../components/Input/Input";
import { ChampionContext } from "../data/ChampionContext";
import { SummonerSpellContext } from "../data/SummonerSpellContext";
import electron from "electron";

const ipcRenderer = electron.ipcRenderer;

function Home() {
  const champions = useContext(ChampionContext);
  const spells = useContext(SummonerSpellContext);
  const [champion, setChampion] = React.useState<string>();
  const [championBan, setChampionBan] = React.useState<string>();
  const [spell1, setSpell1] = React.useState<string>();
  const [spell2, setSpell2] = React.useState<string>();
  const [autoAccept, setAutoAccept] = React.useState<boolean>(true);

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
                id: champ.id,
                name: champ.name,
                image: champ.image.sprite,
              }))}
              label="Champion"
            />
            <Input
              selected={championBan}
              setSelected={setChampionBan}
              content={champions.map((champ) => ({
                id: champ.id,
                name: champ.name,
                image: champ.image.sprite,
              }))}
              label="Champion Ban"
            />
            <Input
              selected={spell1}
              setSelected={setSpell1}
              content={spells.map((spell) => ({
                id: spell.id,
                name: spell.name,
                image: spell.image.full,
              }))}
              label="Summoner Spell 1"
            />
            <Input
              selected={spell2}
              setSelected={setSpell2}
              content={spells.map((spell) => ({
                id: spell.id,
                name: spell.name,
                image: spell.image.full,
              }))}
              label="Summoner Spell 2"
            />
            <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
              <input
                className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                type="checkbox"
                checked={autoAccept}
                onChange={() => setAutoAccept(!autoAccept)}
              />
              <label className="inline-block pl-[0.15rem] hover:cursor-pointer text-white">
                Checked checkbox
              </label>
            </div>
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
