import type { Entity } from './entity'

export class Storage {
  private _roots: Entity[] = []

  public add(entity: Entity) {
    this._roots.push(entity)
  }

  public getEntities() {
    return [...this._roots].sort((a, b) => {
      if (!a.z) {
        return -1
      }

      if (!b.z) {
        return 1
      }

      return a.z - b.z
    })
  }
}
