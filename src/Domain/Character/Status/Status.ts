import { StatusEnum } from "@/Utils/Enums/StatusEnum";

export class Status{
    constructor(
        private type: StatusEnum,
        private current: number,
        private max: number
    ){}
    public getCurrent(): number{
        return this.current;
    }
    public getMax(): number{
        return this.max;
    }
    public getType(): StatusEnum{
        return this.type;
    }
}