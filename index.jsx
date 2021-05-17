import React from "React"
import ReactDom from "ReactDom"
import HelloClass from "./HelloClass"

ReactDom.render(
  <div className="asd">
    <HelloClass title="hello world!"/>
  </div>,
  document.getElementById('root')
)