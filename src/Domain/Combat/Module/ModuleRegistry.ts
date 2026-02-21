import { Module } from "./Module";
import { ElementsEnum } from "@/Utils/Enums/ElementsEnum";

export class ModuleRegistry {
  private modules = new Map<string, Module>();

  register(module: Module): void {
    this.modules.set(module.getId() ?? module.getId(), module);
  }

  get(id: string): Module {
    const mod = this.modules.get(id);
    if (!mod) throw new Error(`Module não encontrado: ${id}`);
    return mod;
  }

  list(): Module[] {
    return Array.from(this.modules.values());
  }

  listByElement(type: ElementsEnum): Module[] {
    return this.list().filter(m => m.getType() === type)
  }
}
