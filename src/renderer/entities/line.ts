import type { PathBuilder } from '../builder'
import type { PathProps } from './path'
import { Path } from './path'

class LineShape {
  public x1 = 0
  public y1 = 0
  public x2 = 0
  public y2 = 0
}

interface LineProps extends PathProps {
  shape?: Partial<LineShape>
}

export class Line extends Path<LineProps> {
  constructor(props?: LineProps) {
    super(props)
  }

  protected override getDefaultShape() {
    return new LineShape()
  }

  protected override getDefaultStyle() {
    return { fill: 'none', stroke: '#000' }
  }

  public buildPath(builder: PathBuilder, shape: LineShape) {
    builder.moveTo(shape.x1, shape.y1)
    builder.lineTo(shape.x2, shape.y2)
  }
}
