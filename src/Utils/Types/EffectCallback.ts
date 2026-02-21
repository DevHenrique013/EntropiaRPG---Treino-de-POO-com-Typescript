import { Character } from "@/Domain/Character/Chacter";

export type EffectCallback = (target: Character, caster: Character) => void;
