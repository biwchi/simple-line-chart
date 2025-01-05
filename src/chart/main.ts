import type { LinearGradient } from '../renderer/entities'
import type { GridMargin } from './grid'
import { Vec2 } from '../lib'
import { Renderer } from '../renderer'
import { Circle, Polygon, Polyline } from '../renderer/entities'
import { Grid } from './grid'

interface ChartOptions {
  data: number[]
  area?: LineChartArea
  smooth?: number
  grid?: {
    margin?: GridMargin
  }
}

interface LineChartArea {
  color: string | LinearGradient
  opacity?: number
}

class Chart {
  private _el: HTMLElement
  private _renderer: Renderer
  private _grid: Grid

  constructor(root: HTMLElement, options: ChartOptions) {
    this._el = root
    this._renderer = new Renderer(this._el)
    this._grid = new Grid({
      width: this.getWidth(),
      height: this.getHeight(),
      data: options.data,
      margin: options.grid?.margin,
    })

    this._drawPoints(options.area, options.smooth)
  }

  public resize(width: number, height: number) {
    this._el.setAttribute('width', width.toString())
    this._el.setAttribute('height', height.toString())
  }

  public getWidth() {
    return this._renderer.getWidth()
  }

  public getHeight() {
    return this._renderer.getHeight()
  }

  private _drawPoints(area?: LineChartArea, smooth?: number) {
    const points = this._grid.getPoints()

    points.forEach((p) => {
      const point = new Circle({
        shape: {
          cx: p.x,
          cy: p.y,
          r: 1,
        },
        style: {
          fill: '#fff',
          stroke: '#0077b6',
        },
        z: 2,
      })

      this._renderer.add(point)
    })

    if (area) {
      let w = this._grid.getWidth()
      let h = this._grid.getHeight()
      const x = this._grid.getAxis('x')
      const y = this._grid.getAxis('y')

      w += x
      h += y

      const closedAt = [new Vec2(w, h), new Vec2(x, h), points[0].clone()]

      this._renderer.add(
        new Polygon({
          shape: {
            points,
            closedAt,
            smooth,
          },
          style: {
            stroke: 'none',
            fill: area.color,
            fillOpacity: area.opacity,
          },
        }),
      )
    }

    const polyline = new Polyline({
      shape: {
        points,
        smooth,
      },
      style: {
        stroke: '#0077b6',
        fill: 'none',
      },
      z: 1,
    })

    this._renderer.add(polyline)
  }
}

export function setupChart(root: HTMLElement, options: ChartOptions) {
  return new Chart(root, options)
}
