import { StatusEnum } from "@/Utils/Enums/StatusEnum";
import {
  ChangeValue,
  StatusDelta,
  StatusSetInterface,
} from "../../../Utils/Interfaces/StatusSetInterface";
import { Status } from './Status';
export class StatusSet implements StatusSetInterface {

  constructor(private statuses: Map<StatusEnum, Status>) {}

  setStatus(type: StatusEnum, status: Status){
    const newStatusType: StatusEnum = status.getType();
    if(type !== newStatusType){
      throw new Error(`Status missing: ${type}`);
    }
    return this.statuses.set(type,status);
  }

  private requireStatus(type: StatusEnum): Status {
    const status = this.statuses.get(type);
    if (!status) throw new Error(`Status missing: ${type}`);
    return status;
  }

  getStatus(type: StatusEnum): Status{
    return this.requireStatus(type);
  }

  current(type: StatusEnum): number {
    return this.getStatus(type).getCurrent();
  }

  max(type: StatusEnum): number{
    return this.getStatus(type).getMax();
  }

  increase(type: StatusEnum, amount: number): void {
    const status = this.getStatus(type);
    if (status) {
      let newStatusValue: number = status.getCurrent() + amount;
      let newStatus = new Status(
        type,
        Math.min(newStatusValue, status.getMax()),
        status.getMax(),
      );
      this.setStatus(type, newStatus);
    }
  }

  decrease(type: StatusEnum, amount: number): void {
    const status = this.getStatus(type);
    if (status) {
      let newStatusValue: number = status.getCurrent() - amount;
      let newStatus = new Status(
        type,
        Math.max(newStatusValue, 0),
        status.getMax(),
      );
      this.setStatus(type, newStatus);
    }
  }

  increaseMax(type: StatusEnum, amount: number): void {
    const status = this.getStatus(type);
    if (status) {
      let newStatusMaxValue: number = status.getMax() + amount;
      let newStatus = new Status(type, status.getCurrent(), newStatusMaxValue);
      this.setStatus(type, newStatus);
    }
  }

  decreaseMax(type: StatusEnum, amount: number): void {
    const status = this.getStatus(type);
    if (status) {
      let newStatusMaxValue: number = status.getMax() - amount;
      let newStatus = new Status(
        type,
        status.getCurrent(),
        Math.max(newStatusMaxValue, 0),
      );
      this.setStatus(type, newStatus);
    }
  }
  
  applyDelta(delta: StatusDelta): void {
    for (const key of Object.keys(delta) as StatusEnum[]) {
      const change = delta[key];
      if (!change) continue;

      const amount = Math.abs(change.Value);

      switch (change.Modifier){
        case ChangeValue.DECREASE:
          this.decrease(key, Math.max(amount, 0));
          break;
        case ChangeValue.INCREASE:
          this.increase(key, Math.min(amount, this.getStatus(key).getMax()));
          break;
        case ChangeValue.DECREASE_MAX:
          this.decreaseMax(key, Math.max(amount, 1));
          break;
        case ChangeValue.INCREASE_MAX:
          this.increaseMax(key, amount);
          break;
      }
    }
  }
}
