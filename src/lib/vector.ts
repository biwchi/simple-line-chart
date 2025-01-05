export class Vec2 {
  public x = 0
  public y = 0

  constructor(x?: number, y?: number) {
    this.x = x ?? 0
    this.y = y ?? 0
  }

  public add(v: Vec2) {
    this.x += v.x
    this.y += v.y
  }

  public sub(v: Vec2) {
    this.x -= v.x
    this.y -= v.y
  }

  public scale(s: number) {
    this.x *= s
    this.y *= s

    return this
  }

  public distance(v: Vec2) {
    const dx = this.x - v.x
    const dy = this.y - v.y

    return Math.sqrt(dx * dx + dy * dy)
  }

  public clone() {
    return new Vec2(this.x, this.y)
  }

  static add(a: Vec2, b: Vec2) {
    return new Vec2(a.x + b.x, a.y + b.y)
  }

  static sub(v1: Vec2, v2: Vec2) {
    return new Vec2(v1.x - v2.x, v1.y - v2.y)
  }

  static scale(v: Vec2, s: number) {
    return new Vec2(v.x * s, v.y * s)
  }

  static equals(a: Vec2, b: Vec2) {
    return a.x === b.x && a.y === b.y
  }
}
