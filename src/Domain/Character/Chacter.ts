import { CharacterClassEnum } from "@/Utils/Enums/CharacterClassEnum";
import { CharacterInterface } from "@/Utils/Interfaces/CharacterInterface";
import { MousePointerSquareDashedIcon } from "lucide-react";
import { StatusSet } from "./Status/StatusSet";
import { AttackSet } from "../Combat/Attack/AttackSet";
import { Effect } from "../Combat/Module/Effect/Effect";
import { StatusEnum } from "@/Utils/Enums/StatusEnum";
import { GameErrorCode } from "@/Utils/Enums/GameErrorCode";
import { Status } from "./Status/Status";
import { StatusDelta } from "@/Utils/Interfaces/StatusSetInterface";
import { Attack } from "../Combat/Attack/Attack";
import { CharacterAttackSlotsEnum } from "@/Utils/Enums/CharacterAttackSlotsEnum";
import { Result } from "@/Utils/Types/Result";

export type Immunity = {
  effectId: string;
  counter: number;
};

export class Character implements CharacterInterface {
  constructor(
    private name: string,
    private characterClass: CharacterClassEnum,
    private level: number,
    private statusSet: StatusSet,
    private attackSet: AttackSet,
    private effects: Effect[],
    private skipTurns: number,
    private immunities: Immunity[],
    private readonly MAX_LEVEL: number = 12,
  ) {}
  public debugSnapshot() {
    return {
      name: this.getName(),
      class: this.getClass(),
      level: this.getLevel(),
      alive: this.isAlive(),
      skipTurns: this.skipTurns,
      stats: {
        life: this.statCurrent(StatusEnum.LIFE),
        energy: this.statCurrent(StatusEnum.ENERGY),
        speed: this.statCurrent(StatusEnum.SPEED),
        strength: this.statCurrent(StatusEnum.STRENGTH),
        endurance: this.statCurrent(StatusEnum.ENDURANCE),
      },
      effects: this.effects.map((e) => e.getName()),
      attacks: Array.from(this.attackSet.getAttacks().entries()).map(
        ([slot, atk]) => ({
          slot: String(slot),
          available: atk.isAvailable?.() ?? "(no method)",
          cost: atk.getAttackCost?.() ?? "(no method)",
          modules: atk.getModuleNames?.(),
        }),
      ),
    };
  }

  public getImmunities(): Immunity[] {
    return this.immunities;
  }

  public hasImmunity(effectId: string): boolean {
    return (
      (this.immunities.find((i) => i.effectId === effectId)?.counter ?? 0) > 0
    );
  }

  public setImmunity(effectId: string, turns = 1): void {
    const idx = this.immunities.findIndex((i) => i.effectId === effectId);

    if (idx === -1) {
      this.immunities.push({ effectId, counter: Math.max(0, turns) });
      return;
    }

    // renova pra no mínimo "turns"
    this.immunities[idx].counter = Math.max(
      this.immunities[idx].counter,
      turns,
    );
  }

  public tickImmunities(): void {
    for (const im of this.immunities) {
      if (im.counter > 0) im.counter--;
    }
    this.immunities = this.immunities.filter((im) => im.counter > 0);
  }

  public tickImmunity(effectId: string): void {
    const idx = this.immunities.findIndex((m) => m.effectId === effectId);
    if (idx === -1) return;

    if (this.immunities[idx].counter > 0) this.immunities[idx].counter--;
    if (this.immunities[idx].counter <= 0) this.immunities.splice(idx, 1);
  }

  getLevel(): number {
    return this.level;
  }
  getName(): string {
    return this.name;
  }
  getClass(): CharacterClassEnum {
    return this.characterClass;
  }
  levelUp(): void {
    if (this.level < this.MAX_LEVEL) {
      this.level++;
    }
  }
  getStats(): Pick<StatusSet, "current" | "max"> {
    return this.statusSet;
  }

  applyDelta(delta: StatusDelta): void {
    this.statusSet.applyDelta(delta);
  }

  isAlive(): boolean {
    return this.getStats().current(StatusEnum.LIFE) > 0;
  }
  takeDamage(amount: number): void {
    const resultantDamage = this.blockDamage(amount);
    this.statusSet.decrease(StatusEnum.LIFE, resultantDamage);
  }
  recharge(): void {
    this.statusSet.increase(
      StatusEnum.ENERGY,
      this.statusSet.getStatus(StatusEnum.ENERGY).getMax(),
    );
    this.skipTurn();
  }
  canSpendEnergy(amount: number): boolean {
    const currentEnergy = this.statusSet
      .getStatus(StatusEnum.ENERGY)
      .getCurrent();
    if (currentEnergy < amount) {
      return false;
    }
    return true;
  }
  spendEnergy(amount: number): void {
    this.statusSet.decrease(StatusEnum.ENERGY, amount);
  }
  blockDamage(incomingDamage: number): number {
    const characterEndurance: number = this.statusSet
      .getStatus(StatusEnum.ENDURANCE)
      .getCurrent();
    return Math.max(0, Math.abs(incomingDamage) - characterEndurance);
  }
  addEffects(effects: Effect[]): void {
    this.effects = [...this.effects, ...effects];
  }

  resolveEffects(): string[] {
    const logs: string[] = [];
    for (const effect of this.effects) {
      const name = effect.getName();

      const before = this.snapshotStats();

      const applied = effect.willApplyThisTurn();
      if (applied) {
        effect.apply(this);
        logs.push(`${name} foi aplicado.`);
      }

      effect.tick();

      const expiredNow = effect.isExpired();
      if (expiredNow) {
        effect.onExpire(this);
        logs.push(`${name} expirou.`);
      }

      const after = this.snapshotStats();
      const diff = Character.diffStats(before, after);
      if (diff.length > 0) {
        logs.push(`Mudanças em ${this.getName()}: ${diff.join(", ")}`);
      }
    }

    this.effects = this.effects.filter((e) => !e.isExpired());
    return logs;
  }
  public snapshotStats(): Record<string, number> {
    return {
      LIFE: this.statCurrent(StatusEnum.LIFE),
      ENERGY: this.statCurrent(StatusEnum.ENERGY),
      SPEED: this.statCurrent(StatusEnum.SPEED),
      STRENGTH: this.statCurrent(StatusEnum.STRENGTH),
      ENDURANCE: this.statCurrent(StatusEnum.ENDURANCE),
    };
  }
  public static diffStats(
    before: Record<string, number>,
    after: Record<string, number>,
  ): string[] {
    const changes: string[] = [];
    for (const key of Object.keys(before)) {
      const a = after[key];
      const b = before[key];
      if (a !== b) changes.push(`${key}: ${b} -> ${a}`);
    }
    return changes;
  }
  canAct(): boolean {
    return this.skipTurns === 0;
  }
  rest(): void {
    if (this.skipTurns > 0) {
      this.skipTurns--;
    }
  }
  skipTurn(amount: number = 1): void {
    this.skipTurns += Math.max(0, amount);
  }
  public statCurrent(type: StatusEnum): number {
    return this.statusSet.current(type);
  }

  public selectAvailableAttackSlot(): CharacterAttackSlotsEnum | undefined {
    const entries = Array.from(this.attackSet.getAttacks().entries());

    const available = entries.filter(([_, a]) => a.isAvailable());
    if (available.length === 0) {
      this.skipTurn();
      return undefined;
    }

    const usable = available.filter(([_, a]) =>
      this.canSpendEnergy(a.getAttackCost()),
    );
    if (usable.length === 0) {
      this.recharge();
      return undefined;
    }

    return usable[Math.floor(Math.random() * usable.length)][0];
  }

  public castSelectedAttack(
    slot: CharacterAttackSlotsEnum,
    target: Character,
    caster: Character,
  ): void {
    const attack = this.attackSet.getAttacks().get(slot);
    if (!attack) throw new Error(`Attack slot ${slot} não existe no AttackSet`);
    attack.execute(target, caster);
  }

  public describeAttack(slot: CharacterAttackSlotsEnum): String | undefined {
    return this.attackSet.getAttack(slot)?.describe();
  }

  public getAttack(slot: CharacterAttackSlotsEnum): Attack | undefined {
    return this.attackSet.getAttack(slot);
  }
}
