export function createElement(tag: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

export function appendChild(el: Node, child: Node) {
  el.appendChild(child)
}

export function insertBefore(parent: Node, el: Node, before: Node | null) {
  parent.insertBefore(el, before)
}

export function nextSibling(el: Node) {
  return el.nextSibling
}
