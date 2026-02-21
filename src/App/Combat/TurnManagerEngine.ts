import { Character } from "@/Domain/Character/Chacter";
import { StatusEnum } from "@/Utils/Enums/StatusEnum";

export type LoggerLike = { log(message: string): void };

export type RoundPlan = {
  A: Character;
  B: Character;
  advantageTurns: number;
};

export type TurnOutcome =
  | { kind: "DONE" }
  | { kind: "END"; winner: Character; loser: Character; reason: "DEAD" };

export class TurnManager {
  constructor(private logger: LoggerLike) {}

  public planRound(challenger: Character, opponent: Character): RoundPlan {
    const speedC = challenger.getStats().current(StatusEnum.SPEED);
    const speedO = opponent.getStats().current(StatusEnum.SPEED);

    const sc = Math.max(1, speedC);
    const so = Math.max(1, speedO);

    if (sc >= so) {
      return {
        A: challenger,
        B: opponent,
        advantageTurns: Math.max(1, Math.floor(sc / so)),
      };
    }

    return {
      A: opponent,
      B: challenger,
      advantageTurns: Math.max(1, Math.floor(so / sc)),
    };
  }

  public buildRoundQueue(plan: RoundPlan): Character[] {
    const queue: Character[] = [];

    for (let i = 0; i < plan.advantageTurns; i++) {
      queue.push(plan.A);
    }

    queue.push(plan.B);
    return queue;
  }

  public turn(character: Character, opponent: Character): TurnOutcome {
    if (!character.isAlive()) {
      return {
        kind: "END",
        winner: opponent,
        loser: character,
        reason: "DEAD",
      };
    }

    character.tickImmunities();

    const effectLogs = character.resolveEffects();
    for (const l of effectLogs) this.logger.log(l);

    if (!character.isAlive()) {
      return {
        kind: "END",
        winner: opponent,
        loser: character,
        reason: "DEAD",
      };
    }

    if (!character.canAct()) {
      this.logger.log(`${character.getName()} perdeu o turno.`);
      character.rest();
      return { kind: "DONE" };
    }

    const slot = character.selectAvailableAttackSlot();
    if (slot === undefined) {
      this.logger.log(
        `${character.getName()} não conseguiu selecionar ataque.`,
      );
      return { kind: "DONE" };
    }

    const attack = character.getAttack(slot);
    const attackName = attack
      ? `${String(slot)} = ${attack
          .getModuleNames()
          .map((m) => m.name)
          .join(" + ")}`
      : `slot ${String(slot)}`;

    this.logger.log(
      `${character.getName()} atacou ${opponent.getName()} usando: ${attackName}`,
    );

    const beforeOpponent = opponent.snapshotStats();

    character.castSelectedAttack(slot, opponent, character);

    const afterOpponent = opponent.snapshotStats();
    const diff = Character.diffStats(beforeOpponent, afterOpponent);
    if (diff.length > 0) {
      this.logger.log(
        `Status de ${opponent.getName()} mudou: ${diff.join(", ")}`,
      );
    }

    if (!opponent.isAlive()) {
      return {
        kind: "END",
        winner: character,
        loser: opponent,
        reason: "DEAD",
      };
    }

    return { kind: "DONE" };
  }

  public fight(
    challenger: Character,
    opponent: Character,
    maxRounds = 50,
  ): TurnOutcome {
    this.logger.log(
      `=== BATALHA: ${challenger.getName()} vs ${opponent.getName()} ===`,
    );

    for (let round = 1; round <= maxRounds; round++) {
      const plan = this.planRound(challenger, opponent);
      const queue = this.buildRoundQueue(plan);

      this.logger.log(
        `\n--- ROUND ${round} | ${plan.A.getName()} x${plan.advantageTurns} -> ${plan.B.getName()} ---`,
      );

      for (const attacker of queue) {
        const defender = attacker === challenger ? opponent : challenger;

        const outcome = this.turn(attacker, defender);
        if (outcome.kind === "END") {
          this.logger.log(
            `FIM: ${outcome.winner.getName()} venceu! (${outcome.loser.getName()} morreu)`,
          );
          return outcome;
        }
      }
    }

    const cLife = challenger.getStats().current(StatusEnum.LIFE);
    const oLife = opponent.getStats().current(StatusEnum.LIFE);
    const winner = cLife >= oLife ? challenger : opponent;
    const loser = winner === challenger ? opponent : challenger;

    this.logger.log(
      `\n=== LIMITE DE ROUNDS: ${winner.getName()} venceu por vida. ===`,
    );
    return { kind: "END", winner, loser, reason: "DEAD" };
  }
}
