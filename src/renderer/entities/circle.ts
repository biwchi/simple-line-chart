import type { PathBuilder } from '../builder'
import type { PathProps } from './path'
import { Path } from './path'

class CircleShape {
  public cx = 0
  public cy = 0
  public r = 0
}

interface CircleProps extends PathProps {
  shape?: Partial<CircleShape>
}

export class Circle extends Path<CircleProps> {
  constructor(props: CircleProps) {
    super(props)
  }

  protected override getDefaultShape() {
    return new CircleShape()
  }

  public buildPath(builder: PathBuilder, shape: CircleShape) {
    builder.moveTo(shape.cx + shape.r, shape.cy)
    builder.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2)
  }
}
