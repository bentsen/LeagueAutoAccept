export default (summonerSpellName: string) => {
  const spellPos = new Map([
    [
      "Cleanse",
      {
        name: "Cleanse",
        x: 646,
        y: 466,
      },
    ],
    [
      "Exhaust",
      {
        name: "Exhaust",
        x: 698,
        y: 454,
      },
    ],
    [
      "Flash",
      {
        name: "Flash",
        x: 760,
        y: 473,
      },
    ],
    [
      "Ghost",
      {
        name: "Ghost",
        x: 823,
        y: 473,
      },
    ],
    [
      "Heal",
      {
        name: "Heal",
        x: 631,
        y: 517,
      },
    ],
    [
      "Smite",
      {
        name: "Smite",
        x: 713,
        y: 519,
      },
    ],
    [
      "Teleport",
      {
        name: "Teleport",
        x: 754,
        y: 526,
      },
    ],
    [
      "Ignite",
      {
        name: "Ignite",
        x: 818,
        y: 525,
      },
    ],
    [
      "Barrier",
      {
        name: "Barrier",
        x: 567,
        y: 589,
      },
    ],
  ]);

  return spellPos.get(summonerSpellName);
};
