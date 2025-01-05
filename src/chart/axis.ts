export type AxisDimension = 'x' | 'y'

export class Axis {
  public readonly dim: AxisDimension

  constructor(dim: AxisDimension) {
    this.dim = dim
  }
}
