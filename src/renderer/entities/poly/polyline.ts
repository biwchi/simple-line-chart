import type { Vec2 } from '../../../lib'
import type { PathBuilder } from '../../builder'
import type { PathProps } from '../path'
import { Path } from '.././path'
import { buildPath } from './lib'

class PolylineShape {
  points: Vec2[] = []
  smooth = 0
}

interface PolylineProps extends PathProps {
  shape?: Partial<PolylineShape>
}

export class Polyline extends Path {
  constructor(props?: PolylineProps) {
    super(props)
  }

  protected override getDefaultShape() {
    return new PolylineShape()
  }

  public buildPath(builder: PathBuilder, shape: PolylineShape) {
    buildPath(builder, shape.points, shape.smooth)
  }
}
