export class Repository {
  data: Map<string, any>
  constructor() {
    this.data = new Map();
  }

  add(id: string, entity: any) {
    if (this.data.has(id)) {
      throw new Error(`Entity with id ${id} already exists.`);
    }
    this.data.set(id, entity);
  }

  findById(id: string): any | undefined {
    return this.data.get(id);
  }

  findAll(): any[] {
    return Array.from(this.data.values());
  }

  update(id: string, entity: any) {
    if (!this.data.has(id)) {
      throw new Error(`Entity with id ${id} does not exist.`);
    }
    this.data.set(id, entity);
  }

  delete(id: string) {
    if (!this.data.has(id)) {
      throw new Error(`Entity with id ${id} does not exist.`);
    }
    this.data.delete(id);
  }
}