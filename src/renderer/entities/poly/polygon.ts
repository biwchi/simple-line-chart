import type { Vec2 } from '../../../lib'
import type { PathBuilder } from '../../builder'
import type { EntityProps } from '../../entity'
import { Path } from '../path'
import { buildPath } from './lib'

class PolygonShape {
  points: Vec2[] = []
  closedAt: Vec2[] = []
  smooth = 0
}

interface PolygonProps extends EntityProps {
  shape?: Partial<PolygonShape>
}

export class Polygon extends Path<PolygonProps> {
  constructor(props?: PolygonProps) {
    super(props)
  }

  protected override getDefaultShape() {
    return new PolygonShape()
  }

  public buildPath(builder: PathBuilder, shape: PolygonShape) {
    const { points, closedAt, smooth } = shape
    buildPath(builder, points, smooth)

    if (shape.closedAt.length > 0) {
      closedAt.forEach((point) => {
        builder.lineTo(point.x, point.y)
      })

      builder.closePath()
    }
  }
}
