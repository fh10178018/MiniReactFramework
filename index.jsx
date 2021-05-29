import React from "React"
import ReactDom from "ReactDom"
import HelloClass from "./Component/HelloClass"
import Remove from "./Component/Remove"

ReactDom.render(
  <div className="asd">
    <HelloClass title="文本节点更新案例"/>
    <Remove/>
  </div>,
  document.getElementById('root')
)