export interface GameFlowSession {
  gameClient: GameClient;
  gameData: GameData;
  gameDodge: GameDodge;
  map: Map;
  phase: string;
}

export interface GameClient {
  observerServerIp: string;
  observerServerPort: number;
  running: boolean;
  serverIp: string;
  serverPort: number;
  visible: boolean;
}

export interface GameData {
  gameId: number;
  gameName: string;
  isCustomGame: boolean;
  password: string;
  playerChampionSelections: Assets[];
  queue: Queue;
  spectatorsAllowed: boolean;
  teamOne: Assets[];
  teamTwo: Assets[];
}

export interface Assets {
  additionalProp1: AdditionalProp1;
}

export interface AdditionalProp1 {}

export interface Queue {
  allowablePremadeSizes: number[];
  areFreeChampionsAllowed: boolean;
  assetMutator: string;
  category: string;
  championsRequiredToPlay: number;
  description: string;
  detailedDescription: string;
  gameMode: string;
  gameTypeConfig: GameTypeConfig;
  id: number;
  isRanked: boolean;
  isTeamBuilderManaged: boolean;
  isTeamOnly: boolean;
  lastToggledOffTime: number;
  lastToggledOnTime: number;
  mapId: number;
  maxLevel: number;
  maxSummonerLevelForFirstWinOfTheDay: number;
  maximumParticipantListSize: number;
  minLevel: number;
  minimumParticipantListSize: number;
  name: string;
  numPlayersPerTeam: number;
  queueAvailability: string;
  queueRewards: QueueRewards;
  removalFromGameAllowed: boolean;
  removalFromGameDelayMinutes: number;
  shortName: string;
  showPositionSelector: boolean;
  spectatorEnabled: boolean;
  type: string;
}

export interface GameTypeConfig {
  advancedLearningQuests: boolean;
  allowTrades: boolean;
  banMode: string;
  banTimerDuration: number;
  battleBoost: boolean;
  crossTeamChampionPool: boolean;
  deathMatch: boolean;
  doNotRemove: boolean;
  duplicatePick: boolean;
  exclusivePick: boolean;
  id: number;
  learningQuests: boolean;
  mainPickTimerDuration: number;
  maxAllowableBans: number;
  name: string;
  onboardCoopBeginner: boolean;
  pickMode: string;
  postPickTimerDuration: number;
  reroll: boolean;
  teamChampionPool: boolean;
}

export interface QueueRewards {
  isChampionPointsEnabled: boolean;
  isIpEnabled: boolean;
  isXpEnabled: boolean;
  partySizeIpRewards: number[];
}

export interface GameDodge {
  dodgeIds: number[];
  phase: string;
  state: string;
}

export interface Map {
  assets: Assets;
  categorizedContentBundles: Assets;
  description: string;
  gameMode: string;
  gameModeName: string;
  gameModeShortName: string;
  gameMutator: string;
  id: number;
  isRGM: boolean;
  mapStringId: string;
  name: string;
  perPositionDisallowedSummonerSpells: PerPositionEdSummonerSpells;
  perPositionRequiredSummonerSpells: PerPositionEdSummonerSpells;
  platformId: string;
  platformName: string;
  properties: Assets;
}

export interface PerPositionEdSummonerSpells {
  additionalProp1: AdditionalProp;
  additionalProp2: AdditionalProp;
  additionalProp3: AdditionalProp;
}

export interface AdditionalProp {
  spells: number[];
}
