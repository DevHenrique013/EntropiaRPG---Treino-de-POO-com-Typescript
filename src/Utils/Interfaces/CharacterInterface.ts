import { AttackSet } from "@/Domain/Combat/Attack/AttackSet";
import { CharacterClassEnum } from "../Enums/CharacterClassEnum";
import { Effect } from "@/Domain/Combat/Module/Effect/Effect";
import { StatusSet } from "@/Domain/Character/Status/StatusSet";

export interface CharacterInterface{
    levelUp():void;
    getLevel():number;
    isAlive():boolean;
    takeDamage(amount:number):void;
    recharge():void;
    spendEnergy(amount:number):void;
    blockDamage(incomingDamage:number):number;
    addEffects(effects: Effect[]):void;
    resolveEffects():void;
    canAct():boolean;
}
