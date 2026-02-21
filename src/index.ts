import { CharacterBootstrap } from "./App/Boostrap/CharacterBootstrap";
import { TurnManager } from "./App/Combat/TurnManagerEngine";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const heroLevel: number = getRandomInt(1,12);
let hero = CharacterBootstrap.bootstrapCharacter(
  "O Herói",
  heroLevel
);

const villainLevel: number = getRandomInt(1,12);
let villain = CharacterBootstrap.bootstrapCharacter(
  "O Vilão",
  villainLevel
);

let turnManager = new TurnManager({
  log(message: string): void {
      console.log(message);
  },
});

console.log("=== HERO SNAPSHOT ===");
console.dir(hero.debugSnapshot(), { depth: null });

console.log("=== VILLAIN SNAPSHOT ===");
console.dir((villain as any).debugSnapshot?.() ?? villain, { depth: null });

turnManager.fight(villain, hero);
