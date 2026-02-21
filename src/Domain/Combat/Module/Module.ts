import { Character } from "@/Domain/Character/Chacter";
import { EffectCallback } from "@/Utils/Types/EffectCallback";
import { Effect, EffectMode } from "./Effect/Effect";
import { ElementsEnum } from "@/Utils/Enums/ElementsEnum";

export enum EffectType {
  DAMAGE = "DAMAGE",
  ECHO = "ECHO",
  BOND = "BOND",
  MORPH = "MORPH",
}

export type EffectID = {};

export class Module {
  constructor(
    private id: string,
    private elementalType: ElementsEnum,
    private effectType: EffectType,
    private moduleName: string,
    private energeticCost: number,
    private cooldown: number,
    private effectCallback: EffectCallback,
    private expireCallback: EffectCallback,
    private durationTurns: number,
    private mode: EffectMode = EffectMode.EACH_TURN,
    private description: string,
  ) {}

  public createEffect(caster: Character): Effect {
    return new Effect(
      this.id,
      this.elementalType,
      this.moduleName,
      this.durationTurns,
      this.effectCallback,
      this.expireCallback,
      caster,
      this.mode,
      this.description
    );
  }

  public getCost(): number {
    return this.energeticCost;
  }

  public getId(): string {
    return this.id;
  }

  public getType(): ElementsEnum {
    return this.elementalType;
  }

  public getCooldown(): number {
    return this.cooldown;
  }
  public getEffectType(): EffectType {
    return this.effectType;
  }
  public getName(): string {
    return this.moduleName;
  }

  public getDescription(): string{
    return this.description;
  }
}
