export type SVGVNodeAttrs = Record<
  string,
  string | number | boolean | undefined
>

export interface VNode {
  tag: string
  children: VNode[]
  key: string
  attrs?: SVGVNodeAttrs
  el?: Node
}

export const SVGNS = 'http://www.w3.org/2000/svg'
export const XLINKNS = 'http://www.w3.org/1999/xlink'

export function createVNode(
  tag: string,
  key: string,
  attrs: SVGVNodeAttrs,
  children?: VNode[],
): VNode {
  return {
    tag,
    children: children ?? [],
    attrs,
    key,
  }
}

function createElementOpen(tag: string, attrs: SVGVNodeAttrs) {
  const attrsStr: string[] = []

  Object.entries(attrs).forEach(([key, value]) => {
    let part = key

    if (value === false) {
      return
    }

    if (value !== true && value !== undefined) {
      part += `="${value}"`
    }

    attrsStr.push(part)
  })

  return `<${tag} ${attrsStr.join(' ')}>`
}

function createElementClose(tag: string) {
  return `</${tag}>`
}

export function vNodeToString(vnode: VNode) {
  function convertVNode(vnode: VNode): string {
    const { children, tag, attrs } = vnode

    return (
      createElementOpen(tag, attrs ?? {})
      + children.map(convertVNode).join('')
      + createElementClose(tag)
    )
  }

  return convertVNode(vnode)
}

export function createSVGVNode(
  width: number,
  height: number,
  children: VNode[],
) {
  return createVNode(
    'svg',
    'root',
    {
      width,
      height,
      'xmlns': SVGNS,
      'xmlns:xlink': XLINKNS,
      'version': '1.1',
      'baseProfile': 'full',
    },
    children,
  )
}

export interface BrushScope {
  defs: Record<string, VNode>
  gradientIdx: number
}

export function createBrushScope(): BrushScope {
  return {
    defs: {},
    gradientIdx: 0,
  }
}
