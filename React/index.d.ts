export as namespace React;
export = React;

declare namespace React {
  type ReactNode = Element

  interface Attributes {
    key?: string | number | null;
  }
  
  export interface CreateElement{
    (
      type:string,
      props?:Attributes,
      ...children:ReactNode[]
    ):Element
  }
  
  export interface Renderer {
    (
      vnode:DOMElement,
      container:Element | DocumentFragment | null,
      callback?: () => void
    ):Element
  }
  class Component<P, S> {
    constructor(props:Readonly<P>)
  }
}

