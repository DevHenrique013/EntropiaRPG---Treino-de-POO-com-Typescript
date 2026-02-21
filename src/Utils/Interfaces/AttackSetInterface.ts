import { Attack } from "@/Domain/Combat/Attack/Attack";
import { CharacterAttackSlotsEnum } from "../Enums/CharacterAttackSlotsEnum";
import { Character } from "@/Domain/Character/Chacter";

export interface AttackSetInterface {
  isAttackAvailable(slot: CharacterAttackSlotsEnum): boolean;
  getAttacks(): Map<CharacterAttackSlotsEnum, Attack>;
}
