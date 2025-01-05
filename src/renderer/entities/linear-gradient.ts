import type { GradientStop } from './gradient'
import { Gradient } from './gradient'

export class LinearGradient extends Gradient {
  type: 'linear'

  public x1 = 0
  public y1 = 0
  public x2 = 0
  public y2 = 0

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stops?: GradientStop[],
  ) {
    super(stops ?? [])

    this.type = 'linear'
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }
}

export function isLinearGradient(
  gradient: unknown,
): gradient is LinearGradient {
  return gradient instanceof Gradient && gradient.type === 'linear'
}
