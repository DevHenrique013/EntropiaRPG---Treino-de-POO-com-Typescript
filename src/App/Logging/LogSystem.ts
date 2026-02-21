import { LoggerInterface } from "@/Utils/Interfaces/LoggerInterface";
import { LogEvent } from "@/Utils/Types/LogEvent";


export class LogSystem implements LoggerInterface {
  private entries: LogEvent[] = [];

  emit(event: LogEvent): void {
    this.entries.push(event);
  }

  print(): void {
    for (const entry of this.entries) console.log(`[${entry.type}] ${entry.message}`);
  }

  getEntries(): LogEvent[] {
    return [...this.entries];
  }
}
