import { AttackSetInterface } from "@/Utils/Interfaces/AttackSetInterface";
import { Attack } from "./Attack";
import { CharacterAttackSlotsEnum } from "@/Utils/Enums/CharacterAttackSlotsEnum";
import { Character } from "@/Domain/Character/Chacter";

export class AttackSet implements AttackSetInterface {
  constructor(private attacks: Map<CharacterAttackSlotsEnum, Attack>) {}
  public getAttacks(): Map<CharacterAttackSlotsEnum, Attack> {
    return this.attacks;
  }
  public getAttack(slot: CharacterAttackSlotsEnum): Attack | undefined{
    return this.attacks.get(slot);
  }
  public isAttackAvailable(slot: CharacterAttackSlotsEnum): boolean {
    const attack = this.attacks.get(slot);
    if (!attack) return false;
    return attack.isAvailable();
  }
}
