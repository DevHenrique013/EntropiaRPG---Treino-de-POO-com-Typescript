import { Character } from "@/Domain/Character/Chacter";
import { EffectType, Module } from "@/Domain/Combat/Module/Module";
import { Effect } from "../Module/Effect/Effect";

export class Attack {
  private attackCost: number;
  private attackCooldown: number = 0;
  constructor(private modules: Module[]) {
    this.attackCost = this.calculateAttackCost();
    this.attackCooldown = this.calculateAttackCooldown();
  }

  private calculateAttackCost(): number {
    const modulesNumber = this.modules.length;
    if (modulesNumber === 0) return 0;
    const totalModulesCost = this.modules.reduce(
      (sum, m) => sum + m.getCost(),
      0,
    );

    const attackCost = totalModulesCost;
    return attackCost;
  }

  private calculateAttackCooldown(): number {
    const modulesNumber = this.modules.length;
    if (modulesNumber === 0) return 0;

    const totalModulesCooldown = this.modules.reduce(
      (sum, m) => sum + m.getCost(),
      0,
    );

    const attackCooldown = totalModulesCooldown / modulesNumber;

    return Math.round(attackCooldown);
  }

  public getAttackCost(): number {
    return this.attackCost;
  }

  public getAttackCooldown(): number {
    return this.attackCooldown;
  }

  public execute(target: Character, caster: Character): void {
    if (!caster.canSpendEnergy(this.attackCost)) return;
    caster.spendEnergy(this.attackCost);

    const effects: Effect[] = [];

    for (const module of this.modules) {
      const isBond = module.getEffectType() === EffectType.BOND;
      const id = module.getId();

      if (isBond && target.hasImmunity(id)) continue;

      effects.push(module.createEffect(caster));

      if (isBond) target.setImmunity(id, 1);
    }

    target.addEffects(effects);
  }

  public isAvailable(): boolean {
    return this.attackCooldown !== 0;
  }

  public getModuleNames(): { name: string; description: string }[] {
    return this.modules.map((m) => ({
      name: m.getName(),
      description: m.getDescription(),
    }));
  }

  public describe(): string {
    return this.getModuleNames().join(" + ");
  }
}
