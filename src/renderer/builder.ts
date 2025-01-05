import { isAroundZero, PI, PI2 } from '../lib/math'

export class PathBuilder {
  private _d: string[] = []
  private _str = ''
  private _start = true
  private _invalid = false
  private _p: number

  public reset() {
    this._d = []
    this._str = ''
    this._invalid = false
    this._start = true

    this._p = 10 ** 4
  }

  public moveTo(x: number, y: number) {
    this._add('M', x, y)
  }

  public lineTo(x: number, y: number) {
    this._add('L', x, y)
  }

  public quadraticCurveTo(x1: number, y1: number, x: number, y: number) {
    this._add('Q', x1, y1, x, y)
  }

  public bezierCurveTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number,
  ) {
    this._add('C', x1, y1, x2, y2, x, y)
  }

  public arc(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
  ) {
    this.ellipse(cx, cy, r, r, 0, startAngle, endAngle)
  }

  public ellipse(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    psi: number,
    startAngle: number,
    endAngle: number,
  ) {
    const theta = endAngle - startAngle
    const thetaPos = Math.abs(theta)

    const isCircle = isAroundZero(thetaPos - PI2) || theta >= PI2

    let large = false

    if (isCircle) {
      large = true
    }
    else if (isAroundZero(thetaPos)) {
      large = false
    }

    const x0 = cx + rx * Math.cos(startAngle)
    const y0 = cy + ry * Math.sin(startAngle)

    if (this._start) {
      this._add('M', x0, y0)
    }

    const xRot = Math.round(psi * (180 / PI))

    if (isCircle) {
      const p = 1 / this._p
      const dTheta = 1 * PI2 - p
      this._add(
        'A',
        rx,
        ry,
        xRot,
        large ? 1 : 0,
        1,
        cx + rx * Math.cos(startAngle + dTheta),
        cy + ry * Math.sin(startAngle + dTheta),
      )
    }
    else {
      const x = cx + rx * Math.cos(endAngle)
      const y = cy + ry * Math.sin(endAngle)

      this._add('A', rx, ry, 0, large ? 1 : 0, 0, x, y)
    }
  }

  public closePath() {
    if (this._d.length > 0) {
      this._d.push('Z')
    }
  }

  private _add(command: string, ...args: number[]) {
    const values = [] as number[]

    for (let i = 0; i < args.length; i++) {
      if (Number.isNaN(args[i])) {
        this._invalid = true
        return
      }

      values.push(Math.round(args[i] * this._p) / this._p)
      this._start = command === 'Z'
    }

    this._d.push(command, values.join(' '))
  }

  public generateStr() {
    if (this._invalid) {
      return ''
    }

    this._str = this._d.join(' ')
    this._d = []
  }

  public getStr() {
    return this._str
  }
}
