import { createVNode, type VNode } from './core'
import {
  appendChild,
  createElement,
  insertBefore,
  nextSibling,
} from './domapi'

export const EmptyNode = createVNode('', '', {})

function isSameVNode(oldVNode: VNode, newVNode: VNode) {
  return oldVNode.tag === newVNode.tag && oldVNode.key === newVNode.key
}

function createElm(vNode: VNode) {
  const { tag, children } = vNode

  if (tag) {
    const elm = createElement(tag)
    vNode.el = elm
    updateAttrs(EmptyNode, vNode)

    if (children.length > 0) {
      children.forEach((child) => {
        const created = createElm(child)
        if (created)
          appendChild(elm, created)
      })
    }
  }

  return vNode.el
}

function createKeyToOldIdx(vNodes: VNode[], start: number, end: number) {
  const map: { [key: string]: number } = {}

  for (let i = start; i <= end; i++) {
    const ch = vNodes[i]

    if (map[ch.key]) {
      console.warn(`Duplicate key: ${ch.key}`)
    }

    map[ch.key] = i
  }

  return map
}

function removeVNodes(
  parent: Node,
  vNodes: VNode[],
  startIdx: number,
  endIdx: number,
) {
  for (; startIdx <= endIdx; startIdx++) {
    const ch = vNodes[startIdx]

    if (ch.el) {
      parent.removeChild(ch.el)
    }
  }
}

function addVNodes(
  parent: Node,
  before: Node | null,
  vNodes: VNode[],
  startIdx: number,
  endIdx: number,
) {
  for (; startIdx <= endIdx; startIdx++) {
    const ch = vNodes[startIdx]

    if (ch) {
      insertBefore(parent, createElm(ch), before)
    }
  }
}

function updateChildren(
  parent: Node,
  oldChildren: VNode[],
  newChildren: VNode[],
) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newEndIdx = newChildren.length - 1

  let oldVNodeStart = oldChildren[oldStartIdx]
  let oldVNodeEnd = oldChildren[oldEndIdx]
  let newVNodeStart = newChildren[newStartIdx]
  let newVNodeEnd = newChildren[newEndIdx]

  let oldKeyToIdx: { [key: string]: number } = {}

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldVNodeStart) {
      oldVNodeStart = oldChildren[++oldStartIdx]
    }
    else if (!oldVNodeEnd) {
      oldVNodeEnd = oldChildren[--oldEndIdx]
    }
    else if (!newVNodeStart) {
      newVNodeStart = newChildren[++newStartIdx]
    }
    else if (!newVNodeEnd) {
      newVNodeEnd = newChildren[--newEndIdx]
    }
    else if (isSameVNode(oldVNodeStart, newVNodeStart)) {
      patchVNode(oldVNodeStart, newVNodeStart)
      oldVNodeStart = oldChildren[++oldStartIdx]
      newVNodeStart = newChildren[++newStartIdx]
    }
    else if (isSameVNode(oldVNodeEnd, newVNodeEnd)) {
      patchVNode(oldVNodeEnd, newVNodeEnd)
      oldVNodeEnd = oldChildren[--oldEndIdx]
      newVNodeEnd = newChildren[--newEndIdx]
    }
    else if (isSameVNode(oldVNodeStart, newVNodeEnd)) {
      patchVNode(oldVNodeStart, newVNodeEnd)
      insertBefore(parent, oldVNodeStart.el!, nextSibling(oldVNodeEnd.el!))
      oldVNodeStart = oldChildren[++oldStartIdx]
      newVNodeEnd = newChildren[--newEndIdx]
    }
    else if (isSameVNode(oldVNodeEnd, newVNodeStart)) {
      patchVNode(oldVNodeEnd, newVNodeStart)
      insertBefore(parent, oldVNodeEnd.el!, nextSibling(oldVNodeStart.el!))
      oldVNodeEnd = oldChildren[--oldEndIdx]
      newVNodeStart = newChildren[++newStartIdx]
    }
    else {
      if (!oldKeyToIdx) {
        oldKeyToIdx = createKeyToOldIdx(oldChildren, oldStartIdx, oldEndIdx)
      }

      const idxInOld = oldKeyToIdx[newVNodeStart.key]

      if (idxInOld === undefined) {
        insertBefore(parent, createElm(newVNodeStart), oldVNodeStart.el!)
      }
      else {
        const vNodeToMove = oldChildren[idxInOld]

        if (vNodeToMove.tag !== newVNodeStart.tag) {
          insertBefore(parent, createElm(newVNodeStart), oldVNodeStart.el!)
        }
        else {
          patchVNode(vNodeToMove, newVNodeStart)
          oldChildren[idxInOld] = undefined
          insertBefore(parent, vNodeToMove.el!, oldVNodeStart.el!)
        }
      }

      newVNodeStart = newChildren[++newStartIdx]
    }
  }

  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      const before = newChildren[newEndIdx + 1]
        ? newChildren[newEndIdx + 1].el!
        : null

      addVNodes(parent, before, newChildren, newStartIdx, newEndIdx)
    }
    else {
      removeVNodes(parent, oldChildren, oldStartIdx, oldEndIdx)
    }
  }
}

export function updateAttrs(oldVNode: VNode, vNode: VNode) {
  const elm = vNode.el as HTMLElement
  const oldAttrs = oldVNode.attrs ?? {}
  const attrs = vNode.attrs ?? {}

  if (oldAttrs === attrs) {
    return
  }

  for (const key in attrs) {
    const cur = attrs[key]
    const prev = oldAttrs[key]

    if (cur === prev) {
      continue
    }
    else if (cur === true) {
      elm.setAttribute(key, '')
    }
    else if (cur === false || cur === undefined || cur === null) {
      elm.removeAttribute(key)
    }
    else if (key === 'style') {
      elm.style.cssText = cur.toString()
    }
    else {
      elm.setAttribute(key, cur.toString())
    }
  }

  for (const key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key)
    }
  }
}

function patchVNode(oldVNode: VNode, vNode: VNode) {
  const elm = (vNode.el = oldVNode.el!)
  const oldCld = oldVNode.children
  const newCld = vNode.children

  if (oldVNode === vNode) {
    return
  }

  updateAttrs(oldVNode, vNode)

  if (oldCld.length > 0 && newCld.length > 0) {
    if (oldCld !== newCld) {
      updateChildren(elm, oldCld, newCld)
    }
  }
  else if (oldCld.length > 0) {
    removeVNodes(elm, oldCld, 0, oldCld.length - 1)
  }
  else if (newCld.length > 0) {
    addVNodes(elm, null, newCld, 0, newCld.length - 1)
  }
}

export function patch(oldVNode: VNode, vNode: VNode) {
  if (isSameVNode(oldVNode, vNode)) {
    patchVNode(oldVNode, vNode)
  }
  else {
    const parent = oldVNode.el?.parentNode
    const elm = createElm(vNode)

    if (parent) {
      insertBefore(parent, elm, oldVNode.el!)
      removeVNodes(parent, vNode.children, 0, oldVNode.children.length - 1)
    }
  }

  return vNode
}
