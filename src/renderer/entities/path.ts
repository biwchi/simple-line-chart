import type { EntityProps } from '../entity'
import type { Gradient } from './gradient'
import { type Dictionary, extend, keys } from '../../lib'
import { PathBuilder } from '../builder'
import { Entity } from '../entity'

export interface PathStyle {
  fill?: string | Gradient
  stroke?: string

  fillOpacity?: number
  strokeOpacity?: number
  strokeWidth?: number
}

export interface PathProps extends EntityProps {
  shape?: Dictionary<any>
  style?: PathStyle
}

export class Path<Props extends PathProps = PathProps> extends Entity<Props> {
  public builder?: PathBuilder

  public style: PathStyle
  public shape: Dictionary<any>

  constructor(props?: Props) {
    super()
    this._init(props)
  }

  public createBuilder() {
    this.builder = new PathBuilder()
  }

  public getUpdatedBuilder() {
    if (!this.builder) {
      this.createBuilder()
    }

    this.builder!.reset()
    return this.builder!
  }

  protected getDefaultShape() {
    return {}
  }

  protected getDefaultStyle(): Props['style'] {
    return {}
  }

  public buildPath(_builder: PathBuilder, __shape: Dictionary<any>) {}

  protected override _init(props?: Props) {
    this.shape = this.getDefaultShape()
    this.useStyle(this.getDefaultStyle())

    if (!props) {
      return
    }

    const arrKeys = keys(props)

    for (let i = 0; i < arrKeys.length; i++) {
      const key = arrKeys[i]
      const value = props[key]

      if (key === 'shape') {
        if (value) {
          extend(this.shape, value)
        }
      }
      else if (key === 'style') {
        if (this.style) {
          if (value)
            extend(this.style, value)
        }
        else {
          this.style = value as PathStyle
        }
      }
      else {
        super._attrKV(key, value)
      }
    }
  }
}
