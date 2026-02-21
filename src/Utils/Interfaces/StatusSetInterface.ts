import { Status } from "@/Domain/Character/Status/Status";
import { StatusEnum } from "../Enums/StatusEnum";

export interface StatusSetInterface {
  increase(type: StatusEnum, amount: number): void;
  decrease(type: StatusEnum, amount: number): void;
  increaseMax(type: StatusEnum, amount: number): void;
  decreaseMax(type: StatusEnum, amount: number): void;
  getStatus(type: StatusEnum): Status | undefined;
  current(type: StatusEnum): number | undefined;
  max(type: StatusEnum): number | undefined;
  applyDelta(delta: StatusDelta): void;
}

export type StatusDelta = Partial<Record<StatusEnum, StatusChangeValue>>;

export enum ChangeValue { DECREASE, INCREASE, DECREASE_MAX, INCREASE_MAX }

export type StatusChangeValue = {
  Modifier: ChangeValue,
  Value: number
}
