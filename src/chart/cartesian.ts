import type { Axis, AxisDimension } from './axis'

export class Cartesian {
  private _axes: Axis[] = []
  private _axesByDim: { [key in AxisDimension]?: Axis } = {}

  public getAxis(dim: AxisDimension) {
    return this._axesByDim[dim]
  }

  public addAxis(axis: Axis) {
    this._axes.push(axis)
  }
}
