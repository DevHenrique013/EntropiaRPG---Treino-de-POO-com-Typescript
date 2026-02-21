import { Module, EffectType } from "@/Domain/Combat/Module/Module";
import { ModuleRegistry } from "@/Domain/Combat/Module/ModuleRegistry";
import { ElementsEnum } from "@/Utils/Enums/ElementsEnum";
import { StatusEnum } from "@/Utils/Enums/StatusEnum";
import { ChangeValue } from "@/Utils/Interfaces/StatusSetInterface";
import { EffectMode } from "@/Domain/Combat/Module/Effect/Effect";

export function ModuleFactory(): ModuleRegistry {
  const registry = new ModuleRegistry();

  // ===== FIRE =====

  registry.register(
    new Module(
      "burn",
      ElementsEnum.FIRE,
      EffectType.ECHO,
      "Queimadura",
      10,
      1,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(Math.floor(str / 3));
      },
      () => {},
      3,
      EffectMode.EACH_TURN,
      "Causa dano ao alvo equivalente à 1/3(um terço) da força de quem o enviou durante 3 rodadas",
    ),
  );

  registry.register(
    new Module(
      "ignite",
      ElementsEnum.FIRE,
      EffectType.ECHO,
      "Ignição",
      6,
      1,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(Math.floor(str * 0.2));
      },
      () => {},
      4,
      EffectMode.EACH_TURN,
      "Causa dano ao alvo equivalente à 1/5(um terço) da força de quem o enviou durante 4 rodadas",
    ),
  );

  registry.register(
    new Module(
      "explosion",
      ElementsEnum.FIRE,
      EffectType.BOND,
      "Explosão",
      16,
      2,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(Math.floor(str * 0.5));
        target.skipTurn(1);
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Causa dano ao alvo equivalente à 1/2(metade) da força de quem o enviou, o atordoamento faz o alvo perder 1 turno",
    ),
  );

  // ===== BASIC =====

  registry.register(
    new Module(
      "weak_damage",
      ElementsEnum.BASIC,
      EffectType.DAMAGE,
      "Dano Fraco",
      5,
      0,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(Math.floor(str * 0.5));
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Causa dano ao alvo equivalente à 1/2(metade) da força de quem o enviou",
    ),
  );

  registry.register(
    new Module(
      "medium_damage",
      ElementsEnum.BASIC,
      EffectType.DAMAGE,
      "Dano Médio",
      10,
      1,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(str);
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Causa dano ao alvo equivalente à força de quem o enviou",
    ),
  );

  registry.register(
    new Module(
      "heavy_damage",
      ElementsEnum.BASIC,
      EffectType.DAMAGE,
      "Dano Pesado",
      15,
      2,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(Math.floor(str * 2));
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Causa dano ao alvo equivalente ao dobro(2x) da força de quem o enviou",
    ),
  );

  registry.register(
    new Module(
      "insane_damage",
      ElementsEnum.BASIC,
      EffectType.DAMAGE,
      "Dano INSANO",
      40,
      3,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(Math.floor(str * 3));
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Causa dano ao alvo equivalente ao triplo (3x) da força de quem o enviou",
    ),
  );

  // ===== WATER =====

  registry.register(
    new Module(
      "drain",
      ElementsEnum.WATER,
      EffectType.MORPH,
      "Drenar",
      15,
      1,
      (target, caster) => {
        target.applyDelta({
          [StatusEnum.SPEED]: {
            Modifier: ChangeValue.DECREASE,
            Value: caster.getStats().max(StatusEnum.ENERGY) / 5,
          },
        });
        target.applyDelta({
          [StatusEnum.SPEED]: {
            Modifier: ChangeValue.INCREASE,
            Value: caster.getStats().max(StatusEnum.ENERGY) / 5,
          },
        });
      },
      () => {},
      2,
      EffectMode.ONCE,
      "Remove energia do alvo e a envia para quem o enviou",
    ),
  );

  registry.register(
    new Module(
      "freeze",
      ElementsEnum.WATER,
      EffectType.BOND,
      "Congelar",
      18,
      2,
      (target, caster) => {
        const str = caster?.statCurrent(StatusEnum.STRENGTH) ?? 0;

        target.applyDelta({
          [StatusEnum.ENERGY]: {
            Modifier: ChangeValue.INCREASE,
            Value: target.getStats().max(StatusEnum.ENERGY) / 5,
          },
        });

        target.skipTurn(1);
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Remove 20% da energia do alvo e o congela, fazendo ele perder 1 turno,",
    ),
  );

  registry.register(
    new Module(
      "splash_drain",
      ElementsEnum.WATER,
      EffectType.MORPH,
      "Esguicho Drenante",
      22,
      1,
      (target, caster) => {
        const str = caster.statCurrent(StatusEnum.STRENGTH) ?? 0;
        target.takeDamage(Math.floor(str));
        target.applyDelta({
          [StatusEnum.ENERGY]: {
            Modifier: ChangeValue.DECREASE,
            Value: caster.getStats().max(StatusEnum.ENERGY) / 5,
          },
        });
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Remove energia do alvo e causa dano",
    ),
  );

  registry.register(
    new Module(
      "weakness",
      ElementsEnum.WATER,
      EffectType.MORPH,
      "Fraqueza",
      25,
      2,
      (target) =>
        target.applyDelta({
          [StatusEnum.STRENGTH]: { Modifier: ChangeValue.DECREASE, Value: target.getStats().current(StatusEnum.STRENGTH) / 3},
        }),
      (target) => {
        target.applyDelta({
          [StatusEnum.STRENGTH]: { Modifier: ChangeValue.INCREASE, Value: target.getStats().max(StatusEnum.STRENGTH) },
        })
        if (target.getStats().max(StatusEnum.STRENGTH) > 50) {
          target.applyDelta({
            [StatusEnum.STRENGTH]: {
              Modifier: ChangeValue.DECREASE_MAX,
              Value: target.getStats().current(StatusEnum.STRENGTH) / 10,
            },
          });
        }
      },
      3,
      EffectMode.ONCE,
      "Diminui temporariamente a força do alvo, ao terminar a reduz em 10% PERMANENTEMENTE",
    ),
  );

  // ===== PLANT =====

  registry.register(
    new Module(
      "poison",
      ElementsEnum.PLANT,
      EffectType.ECHO,
      "Veneno",
      35,
      2,
      (target, caster) => {
        const damage = target.statCurrent(StatusEnum.LIFE) / 8;
        target.takeDamage(damage);
      },
      () => {},
      4,
      EffectMode.EACH_TURN,
      "Causa dano equivalente à 1/8 da vida do alvo durante 4 turnos"
    ),
  );

  registry.register(
    new Module(
      "root",
      ElementsEnum.PLANT,
      EffectType.BOND,
      "Enraizar",
      34,
      2,
      (target, caster) => {
        target.applyDelta({
          [StatusEnum.ENDURANCE] : {
            Modifier: ChangeValue.DECREASE,
            Value: target.statCurrent(StatusEnum.ENDURANCE) / 4
          }
        });
        target.skipTurn(1);
      },
      () => {},
      1,
      EffectMode.ONCE,
      "Remove 1/4(um quarto) da resistência do alvo e o deixa enrraizado, o fazendo perder 1 turno"
    ),
  );

  registry.register(
    new Module(
      "regrowth",
      ElementsEnum.PLANT,
      EffectType.ECHO,
      "Regeneração",
      30,
      2,
      (target, caster) => {
        const heal = caster.getStats().max(StatusEnum.LIFE) * 0.15;
        caster.applyDelta({
          [StatusEnum.LIFE]: { Modifier: ChangeValue.INCREASE, Value: heal },
        });
      },
      () => {},
      3,
      EffectMode.EACH_TURN,
      "Regenera 15% da vida de quem o aplicou durante 3"
    ),
  );

  registry.register(
    new Module(
      "expose",
      ElementsEnum.PLANT,
      EffectType.MORPH,
      "Expor Armadura",
      35,
      2,
      (target) =>
        target.applyDelta({
          [StatusEnum.ENDURANCE]: { Modifier: ChangeValue.DECREASE, Value: target.getStats().current(StatusEnum.ENDURANCE)/2},
        }),
      (target) =>{
        target.applyDelta({
          [StatusEnum.ENDURANCE]: { Modifier: ChangeValue.INCREASE, Value: target.getStats().max(StatusEnum.ENDURANCE)/2},
        });
      },
      3,
      EffectMode.ONCE,
      "Remove 1/2(metade) da armadura do alvo, ficando sem ela durante 3 rodadas"
    ),
  );

  return registry;
}
