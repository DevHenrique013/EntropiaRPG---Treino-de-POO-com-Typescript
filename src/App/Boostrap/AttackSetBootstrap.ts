import { AttackSet } from "@/Domain/Combat/Attack/AttackSet";
import { Attack } from "@/Domain/Combat/Attack/Attack";
import { ModuleRegistry } from "@/Domain/Combat/Module/ModuleRegistry";
import { Module, EffectType } from "@/Domain/Combat/Module/Module";
import { ElementsEnum } from "@/Utils/Enums/ElementsEnum";
import { CharacterClassEnum } from "@/Utils/Enums/CharacterClassEnum";
import { CharacterAttackSlotsEnum } from "@/Utils/Enums/CharacterAttackSlotsEnum";
import {
  chance,
  pickOne,
  pickManyUnique,
} from "@/Utils/Helpers/RandomNumberGenerator";

type BuildConfig = {
  damageChance: number;
  echoChance: number;
  utilityChance: number;
  maxModulesPerAttack: 2 | 3;
};

export class AttackSetBootstrap {
  
  private static configByClass(cls: CharacterClassEnum): BuildConfig {
    switch (cls) {
      case CharacterClassEnum.TANK:
        return { damageChance: 0.7, echoChance: 0.7, utilityChance: 0.8, maxModulesPerAttack: 3 };
      case CharacterClassEnum.SUPPORT:
        return { damageChance: 0.4,echoChance: 0.9, utilityChance: 0.9, maxModulesPerAttack: 3 };
      case CharacterClassEnum.STRIKER:
      default:
        return { damageChance: 1,echoChance: 0.5, utilityChance: 0.6, maxModulesPerAttack: 3 };
    }
  }

  public static bootstrapAttackSet(
    characterClass: CharacterClassEnum,
    element: ElementsEnum,
    registry: ModuleRegistry,
  ): AttackSet {
    const modules = registry.list();

    // 1) pool do elemento + básicos como coringa
    const pool = modules.filter(
      (m) => m.getType() === element || m.getType() === ElementsEnum.BASIC,
    );

    if (pool.length === 0) {
      throw new Error(`Nenhum módulo disponível para elemento ${element}`);
    }

    // 2) agrupa por tipo
    const byDamage = pool.filter(
      (m) => m.getEffectType() === EffectType.DAMAGE,
    );
    const byEcho = pool.filter((m) => m.getEffectType() === EffectType.ECHO);
    const byBond = pool.filter((m) => m.getEffectType() === EffectType.BOND);
    const byMorph = pool.filter((m) => m.getEffectType() === EffectType.MORPH);
    const byUtility = [...byBond, ...byMorph];

    const cfg = this.configByClass(characterClass);

    const attacksMap = new Map<CharacterAttackSlotsEnum, Attack>();

    const slots: CharacterAttackSlotsEnum[] = [
      CharacterAttackSlotsEnum.SLOT_1,
      CharacterAttackSlotsEnum.SLOT_2,
      CharacterAttackSlotsEnum.SLOT_3,
      CharacterAttackSlotsEnum.SLOT_4,
    ];

    for (const slot of slots) {
      const attackModules = this.buildOneAttackModules({
        byDamage,
        byEcho,
        byUtility,
        max: cfg.maxModulesPerAttack,
        damageChance: cfg.damageChance,
        echoChance: cfg.echoChance,
        utilityChance: cfg.utilityChance,
      });

      attacksMap.set(slot, new Attack(attackModules));
    }

    return new AttackSet(attacksMap);
  }

  private static buildOneAttackModules(args: {
    byDamage: Module[];
    byEcho: Module[];
    byUtility: Module[];
    max: 2 | 3 ;
    damageChance: number;
    echoChance: number;
    utilityChance: number;
  }): Module[] {
    const { byDamage, byEcho, byUtility, max, damageChance, echoChance, utilityChance } =
      args;

    const chosen: Module[] = [];

    if (chance(damageChance)) {
      const damage = pickOne(byDamage);
      if (damage && !chosen.some((m) => m.getId() === damage.getId()))
        chosen.push(damage);
    }

    if (max >= 2 && chance(echoChance)) {
      const echo = pickManyUnique(byEcho,2);
      echo.forEach(selected => {
        if (echo && !chosen.some((m) => m.getId() === selected.getId()))
        chosen.push(selected);
      });
    }

    if (max >= 3 && chance(utilityChance)) {
      const util = pickManyUnique(byUtility,2);
      util.forEach(selected => {
        if (util && !chosen.some((m) => m.getId() === selected.getId()))
        chosen.push(selected);
      });
    }
    
    while (chosen.length < max-1) {
      const fallback = pickOne([...byDamage, ...byEcho, ...byUtility]);
      if (!fallback) break;
      if (!chosen.some((m) => m.getId() === fallback.getId()))
        chosen.push(fallback);
      else break;
    }

    return chosen;
  }
}
