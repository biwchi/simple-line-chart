import type { Dictionary } from '../lib'
import type { BrushScope, SVGVNodeAttrs, VNode } from './core'
import type { PathStyleProps } from './entities'

import type { Gradient } from './entities/gradient'
import type { Entity } from './entity'
import { createVNode } from './core'
import { isLinearGradient } from './entities/linear-gradient'
import { Path } from './entities/path'

const NONE = 'none'

function setGradient(
  style: Dictionary<any>,
  attrs: SVGVNodeAttrs,
  key: 'fill' | 'stroke',
  scope: BrushScope,
) {
  const gradient = style[key] as Gradient
  const stops = gradient.stops
  const gradientAttrs: SVGVNodeAttrs = {}
  const stopsNodes: VNode[] = []

  let tag = ''

  if (isLinearGradient(gradient)) {
    const { x1, y1, x2, y2 } = gradient

    tag = 'linearGradient'
    gradientAttrs.x1 = x1
    gradientAttrs.y1 = y1
    gradientAttrs.x2 = x2
    gradientAttrs.y2 = y2
  }
  else {
    console.error('invalid gradient type')
    return
  }

  stops.forEach((stop, i) => {
    const { offset, color } = stop
    stopsNodes.push(
      createVNode('stop', i.toString(), {
        offset,
        'stop-color': color,
      }),
    )
  })
  const id = `g-${scope.gradientIdx++}`
  gradientAttrs.id = id
  const vnode = createVNode(tag, id, gradientAttrs, stopsNodes)

  scope.defs[id] = vnode
  attrs[key] = `url(#${id})`
}

function styleHasFill(style: Dictionary<any>): style is PathStyleProps {
  return style.fill && style.fill !== 'none'
}

function styleHasStroke(style: Dictionary<any>): style is PathStyleProps {
  return style.stroke && style.stroke !== 'none'
}

function mapToStyle(
  updateAttr: (key: string, value: string | unknown) => void,
  style: Dictionary<any>,
) {
  if (styleHasFill(style)) {
    updateAttr('fill', style.fill)
    updateAttr('fill-opacity', style.fillOpacity)
  }
  else {
    updateAttr('fill', NONE)
  }

  if (styleHasStroke(style)) {
    updateAttr('stroke', style.stroke)
    updateAttr('stroke-opacity', style.strokeOpacity)
    updateAttr('stroke-width', style.strokeWidth)
  }
}

function setStyleAttr(
  attrs: SVGVNodeAttrs,
  style: Dictionary<any>,
  scope: BrushScope,
) {
  return mapToStyle((key, value) => {
    const fillOrStroke = key === 'fill' || key === 'stroke'

    if (fillOrStroke && isLinearGradient(value)) {
      setGradient(style, attrs, key, scope)
    }
    else {
      attrs[key] = value as string | number
    }
  }, style)
}

function brushSVGPath(el: Path, scope: BrushScope) {
  const attrs = {} as SVGVNodeAttrs
  const builder = el.getUpdatedBuilder()

  el.buildPath(builder, el.shape)
  builder.generateStr()
  attrs.d = builder.getStr()

  setStyleAttr(attrs, el.style, scope)

  return createVNode('path', `${el.id}`, attrs)
}

export function brush(entity: Entity, scope: BrushScope): VNode {
  if (entity instanceof Path) {
    return brushSVGPath(entity, scope)
  }
}
