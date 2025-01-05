import type { Dictionary } from '../lib'
import { guid } from '../lib'

export interface EntityProps {
  style?: Dictionary<any>
  z?: number
}

export class Entity<Props extends EntityProps = EntityProps> {
  public id = guid()
  public style: Dictionary<any>
  public z?: number

  constructor(attrs?: Props) {
    this._init(attrs)
  }

  protected _init(attrs?: Props) {
    this.attr(attrs)
  }

  protected useStyle(style: Props['style']) {
    if (style) {
      this.style = style
    }
  }

  private attr(attrs?: Props) {
    for (const key in attrs) {
      const value = attrs[key]
      this._attrKV(key, value)
    }
  }

  protected _attrKV(key: keyof Props, value: unknown) {
    (this as any)[key] = value
  }
}
