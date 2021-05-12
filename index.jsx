import React from "./React/index"
import ReactDom from "./ReactDom/index"
import HelloClass from "./HelloClass.jsx"

ReactDom.render(
  <div className="asd">
    <HelloClass name="Hello Word！(class component)"/>
  </div>,
  document.getElementById('root')
)