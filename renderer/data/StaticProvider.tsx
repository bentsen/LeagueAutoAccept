import ChampionProvider from "./ChampionContext";
import SummonerSpellProvider from "./SummonerSpellContext";
import VersionProvider from "./VersionContext";

const StaticProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <VersionProvider>
        <ChampionProvider>
          <SummonerSpellProvider>{children}</SummonerSpellProvider>
        </ChampionProvider>
      </VersionProvider>
    </>
  );
};

export default StaticProvider;
