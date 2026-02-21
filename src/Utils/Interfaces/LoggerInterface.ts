import { LogEvent } from "../Types/LogEvent";

export interface LoggerInterface {
  emit(event: LogEvent): void;
}


