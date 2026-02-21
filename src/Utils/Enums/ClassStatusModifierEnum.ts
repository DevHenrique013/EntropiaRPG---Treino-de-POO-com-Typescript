import { CharacterClassEnum } from "./CharacterClassEnum";
import { StatusEnum } from "./StatusEnum";

export type StatusModifier = {
  [StatusEnum.LIFE]: number;
  [StatusEnum.ENERGY]: number;
  [StatusEnum.SPEED]: number;
  [StatusEnum.STRENGTH]: number;
  [StatusEnum.ENDURANCE]: number;
};

export const CLASS_STATUS_MODIFIERS: Record<
  CharacterClassEnum,
  StatusModifier
> = {
  [CharacterClassEnum.TANK]: {
    [StatusEnum.LIFE]: 5,
    [StatusEnum.ENERGY]: 2,
    [StatusEnum.SPEED]: 2,
    [StatusEnum.STRENGTH]: 2,
    [StatusEnum.ENDURANCE]: 4
  },
  [CharacterClassEnum.STRIKER]: {
    [StatusEnum.LIFE]: 2,
    [StatusEnum.ENERGY]: 2,
    [StatusEnum.SPEED]: 4,
    [StatusEnum.STRENGTH]: 5,
    [StatusEnum.ENDURANCE]: 2
  },
  [CharacterClassEnum.SUPPORT]: {
    [StatusEnum.LIFE]: 2,
    [StatusEnum.ENERGY]: 4,
    [StatusEnum.SPEED]: 5,
    [StatusEnum.STRENGTH]: 2,
    [StatusEnum.ENDURANCE]: 2
  },
};
