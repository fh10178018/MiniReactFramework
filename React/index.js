 const React = {} 

/**
 * 生成React虚拟节点
 */
React.createElement = function (type,props,...children) {
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
}

 export default React