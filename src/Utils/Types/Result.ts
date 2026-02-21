import { GameErrorCode } from "../Enums/GameErrorCode";

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: GameError };


export type GameErrorSeverity = "INFO" | "WARN" | "FATAL";

export type GameError = {
  code: GameErrorCode;
  severity: GameErrorSeverity;
  message: string;
  data?: unknown;
};
