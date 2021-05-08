export as namespace ReactDom;

export const render:Renderer

export interface Renderer {
  (
    vnode:DOMElement,
    container:Element | DocumentFragment | null,
    callback?: () => void
  ):Element
}