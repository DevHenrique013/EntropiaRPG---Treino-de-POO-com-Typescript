import { LogEventType } from "../Enums/LogEventType";

export type LogEvent = {
  type: LogEventType;
  message: string;
  data?: unknown;
};
