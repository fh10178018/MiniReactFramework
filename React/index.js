 import ReactDom from '../ReactDom/index';
 import {enqueueSetState} from "./setStateQueue"
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
    enqueueSetState(changeVal,this)
  }
}

export default {
  createElement,
  Component
};