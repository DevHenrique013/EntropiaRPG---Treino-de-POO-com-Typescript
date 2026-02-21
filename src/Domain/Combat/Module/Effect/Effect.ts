import { Character } from "@/Domain/Character/Chacter";
import { ElementsEnum } from "@/Utils/Enums/ElementsEnum";
import { EffectCallback } from "@/Utils/Types/EffectCallback";

export enum EffectMode {
  EACH_TURN = "EACH_TURN",
  ONCE = "ONCE",
}

export class Effect {
  private hasApplied = false;

  constructor(
    private id: string,
    private type: ElementsEnum,
    private effectName: string,
    private remainingTurns: number = 1,
    private applyCallback: EffectCallback,
    private expireCallback: EffectCallback,
    private caster: Character,
    private mode: EffectMode = EffectMode.EACH_TURN,
    private description: string
  ) {}

  public apply(target: Character): void {
    if (this.mode === EffectMode.ONCE && this.hasApplied) return;
    this.applyCallback(target, this.caster);
    this.hasApplied = true;
  }

  public willApplyThisTurn(): boolean {
    return !(this.mode === EffectMode.ONCE && this.hasApplied);
  }

  public tick(): void {
    this.remainingTurns--;
  }

  public isExpired(): boolean {
    return this.remainingTurns <= 0;
  }

  public onExpire(target: Character): void {
    if (!this.isExpired()) return;
    this.expireCallback(target, this.caster);
  }

  public getName(): string {
    return this.effectName;
  }

  public getId(): string{
    return this.id;
  }
}
