 import { renderComponent } from '../ReactDom/index';
/**
 * 生成React虚拟节点
 */
var createElement = function (type,props,...children) {
  return {
    type,
    props,
    children
  }
}

class Component {
  constructor(props={}){
    this.state ={};
    this.props = props;
  }
  setState(changeVal){
    // 这里用尝试用异步的方法更新内容
    Object.assign(this.state, changeVal)
    // 利用renderComponent方法去重新渲染组件
    renderComponent(this);
  }
}

 export default {
  createElement,
  Component
 };