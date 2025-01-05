import type { BrushScope, VNode } from './core'
import type { Entity } from './entity'

import { PathBuilder } from './builder'
import { createBrushScope, createSVGVNode, createVNode } from './core'
import { createElement } from './domapi'
import { brush } from './graphic'
import { EmptyNode, patch, updateAttrs } from './patch'
import { Storage } from './storage'

export class Renderer {
  private _root: HTMLElement
  private _svgDom: SVGElement
  private _storage: Storage
  private _builder: PathBuilder

  private _oldVNode: VNode
  private _vNode: VNode

  private _width: number
  private _height: number

  constructor(root: HTMLElement) {
    this._root = root
    this._storage = new Storage()
    this._builder = new PathBuilder()

    const { width, height } = this._root.getBoundingClientRect()

    this._width = width
    this._height = height

    this._oldVNode = createSVGVNode(width, height, [])

    if (this._root) {
      const svgRoot = (this._svgDom = this._oldVNode.el = createElement('svg'))
      updateAttrs(EmptyNode, this._oldVNode)
      this._root.appendChild(svgRoot)
    }

    this._refresh()
  }

  public getWidth() {
    return this._width
  }

  public getHeight() {
    return this._height
  }

  public add(entity: Entity) {
    this._storage.add(entity)
    this._refresh()
  }

  private _refresh() {
    if (this._root) {
      const vnode = this._renderToVNode()
      patch(this._oldVNode, vnode)
      this._oldVNode = vnode
    }
  }

  private _renderToVNode() {
    const width = this._width
    const height = this._height

    const scope = createBrushScope()
    const children: VNode[] = []
    const list = this._storage.getEntities()

    this._paintList(list, children, scope)

    if (Object.keys(scope.defs).length > 0) {
      children.push(createVNode('defs', 'defs', {}, Object.values(scope.defs)))
    }

    return createSVGVNode(width, height, children)
  }

  private _paintList(list: Entity[], out: VNode[], scope: BrushScope) {
    list.forEach(entity => out.push(brush(entity, scope)))
  }
}
