import { parsePercent, Vec2 } from '../lib'

export type GridMargin = number | number[] | string | string[]

interface GridOptions {
  width: number
  height: number
  data: number[]
  margin?: GridMargin
}

class BoundingRect {
  public x: number
  public y: number
  public width: number
  public height: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

export class Grid {
  private _rect: BoundingRect
  private _data: number[]

  constructor(opts: GridOptions) {
    const { width, height, data, margin } = opts
    const { left, right, top, bottom } = this._parseMargin(margin)

    const w = width - left - right
    const h = height - top - bottom

    this._rect = new BoundingRect(left, top, w, h)
    this._data = data
  }

  public getWidth() {
    return this._rect.width
  }

  public getHeight() {
    return this._rect.height
  }

  public getAxis(dim: 'x' | 'y') {
    return this._rect[dim]
  }

  public getPoints() {
    const out: Vec2[] = []
    const [min, max] = this._minmax()

    this._data.forEach((data, i) => {
      out.push(this._getPoint(data, i, this._data.length, min, max))
    })

    return out
  }

  private _parseMargin(margin?: GridMargin) {
    let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    if (!margin) {
      return { left, right, top, bottom }
    }

    if (Array.isArray(margin)) {
      left = this._parsePercent(margin[0])
      right = this._parsePercent(margin[1])
      top = this._parsePercent(margin[2])
      bottom = this._parsePercent(margin[3])
    }
    else {
      const val = this._parsePercent(margin)
      left = this._parsePercent(val)
      right = this._parsePercent(val)
      top = this._parsePercent(val)
      bottom = this._parsePercent(val)
    }

    return { left, right, top, bottom }
  }

  private _parsePercent(val: number | string) {
    if (typeof val === 'string') {
      const percent = parsePercent(val)
      return percent * this._rect.width
    }

    return val
  }

  private _minmax() {
    const { _data } = this
    return [Math.min(..._data), Math.max(..._data)]
  }

  private _getPoint(
    data: number,
    idx: number,
    len: number,
    min: number,
    max: number,
  ) {
    const { width, height, x: rectX, y: rectY } = this._rect

    // const y = height - ((val - minData) / (maxData - minData)) * height
    // const x = (i / (this._data.length - 1)) * width
    const x = (idx / (len - 1)) * width
    const y = height - ((data - min) / (max - min)) * height

    const p = new Vec2(x, y)
    p.add(new Vec2(rectX, rectY))

    return p
  }
}
