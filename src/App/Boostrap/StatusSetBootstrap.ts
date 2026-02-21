import { Status } from "@/Domain/Character/Status/Status";
import { StatusSet } from "@/Domain/Character/Status/StatusSet";
import { CharacterClassEnum } from "@/Utils/Enums/CharacterClassEnum";
import { CLASS_STATUS_MODIFIERS } from "@/Utils/Enums/ClassStatusModifierEnum";
import { StatusEnum } from "@/Utils/Enums/StatusEnum";

export const BASE_STATUS_VALUES: Record<StatusEnum, number> = {
  [StatusEnum.LIFE]: 500,
  [StatusEnum.STRENGTH]: 100,
  [StatusEnum.ENERGY]: 100,
  [StatusEnum.ENDURANCE]: 25,
  [StatusEnum.SPEED]: 100,
};

export class StatusSetBootstrap {
  public static bootstrapStatusSet(
    characterLevel: number,
    characterClass: CharacterClassEnum,
  ) {
    const statuses = new Map<StatusEnum, Status>();
    for (const value of Object.values(StatusEnum) as StatusEnum[]) {
      const newStatus = this.bootstrapStatus(
        characterLevel,
        characterClass,
        value,
      );
      statuses.set(value, newStatus);
    }

    return new StatusSet(statuses);
  }

  public static bootstrapStatus(
    characterLevel: number,
    characterClass: CharacterClassEnum,
    type: StatusEnum,
  ) {
    const baseStatusValue: number = BASE_STATUS_VALUES[type];
    const characterClassMultiplier: number =
      CLASS_STATUS_MODIFIERS[characterClass][type];
      
    const expGrowth = Math.exp(characterLevel * 0.035);

    const randomBonus = Math.floor(Math.random() * (baseStatusValue + 1));

    const max = Math.floor(
      baseStatusValue * characterClassMultiplier * expGrowth + randomBonus,
    );
    const current: number = max;
    return new Status(type, current, max);
  }
}
