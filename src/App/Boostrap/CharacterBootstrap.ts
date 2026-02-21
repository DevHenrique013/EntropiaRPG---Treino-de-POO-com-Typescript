import { Character } from "@/Domain/Character/Chacter";
import { StatusSet } from "@/Domain/Character/Status/StatusSet";
import { AttackSet } from "@/Domain/Combat/Attack/AttackSet";
import { CharacterClassEnum } from "@/Utils/Enums/CharacterClassEnum";
import { ElementsEnum } from "@/Utils/Enums/ElementsEnum";
import { AttackSetBootstrap } from "./AttackSetBootstrap";
import { StatusSetBootstrap } from "./StatusSetBootstrap";
import { pickOneOrThrow } from "@/Utils/Helpers/RandomNumberGenerator";
import { ModuleFactory } from "@/Domain/Combat/Module/ModuleFactory";

export class CharacterBootstrap {
  public static bootstrapCharacter(
    name: string,
    level: number,
    element?: ElementsEnum,
    characterClass?: CharacterClassEnum,
    attackSet?: AttackSet,
    statusSet?: StatusSet,
  ): Character {
    const classesList = Object.values(
      CharacterClassEnum,
    ) as CharacterClassEnum[];
    const chosenClass: CharacterClassEnum =
      characterClass ?? pickOneOrThrow(classesList, "CharacterClassEnum vazio");

    const chosenElement: ElementsEnum =
      element ??
      pickOneOrThrow(
        Object.values(ElementsEnum) as ElementsEnum[],
        "ElementsEnum vazio",
      );

    const chosenStatusSet =
      statusSet ?? StatusSetBootstrap.bootstrapStatusSet(level, chosenClass);
    const chosenAttackSet =
      attackSet ??
      AttackSetBootstrap.bootstrapAttackSet(chosenClass, chosenElement,ModuleFactory());

    return new Character(
      name,
      chosenClass,
      level,
      chosenStatusSet,
      chosenAttackSet,
      [],
      0,
      []
    );
  }
}
