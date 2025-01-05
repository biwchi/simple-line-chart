import type { PathBuilder } from '../../builder'
import { Vec2 } from '../../../lib'

export function smoothBezier(points: Vec2[], smooth: number) {
  const out: Vec2[] = []

  let v = new Vec2()
  let v1 = new Vec2()
  let v2 = new Vec2()
  let prev: Vec2 | undefined
  let next: Vec2 | undefined

  points.forEach((point, i) => {
    if (i === 0 || i === points.length - 1) {
      return out.push(point.clone())
    }
    else {
      prev = points[i - 1]
      next = points[i + 1]
    }

    v = Vec2.sub(next, prev)
    v.scale(smooth)

    let d0 = point.distance(prev)
    let d1 = point.distance(next)
    const sum = d0 + d1

    if (sum !== 0) {
      d0 /= sum
      d1 /= sum
    }

    v1 = Vec2.scale(v, -d0)
    v2 = Vec2.scale(v, d1)

    const cp1 = Vec2.add(point, v1)
    const cp2 = Vec2.add(point, v2)

    out.push(cp1)
    out.push(cp2)
  })

  return out
}

export function buildPath(
  builder: PathBuilder,
  points: Vec2[],
  smooth: number,
) {
  if (points.length < 1) {
    return
  }

  if (smooth) {
    const smoothPoints = smoothBezier(points, smooth)
    const len = points.length

    builder.moveTo(points[0].x, points[0].y)

    for (let i = 0; i < len - 1; i++) {
      const cp1 = smoothPoints[i * 2]
      const cp2 = smoothPoints[i * 2 + 1]
      const p = points[(i + 1) % len]

      builder.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y)
    }
  }
  else {
    builder.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      builder.lineTo(points[i].x, points[i].y)
    }
  }
}
