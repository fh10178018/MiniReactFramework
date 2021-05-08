const ReactDom = {} 
/**
 * 将虚拟节点转换成真实节点，渲染到目标节点的子节点下
 */
ReactDom.render = function (vnode,container,callback) {
  let realNode;
  if (typeof vnode === "string"){
    // 当为字符串时，直接创建文本节点
    realNode = document.createTextNode(vnode);   
  } else {
    // 根据虚拟DOM创建真实DOM
    realNode = document.createElement(vnode.type);
    // 添加属性
    realNode.props && Object.keys(realNode.props).forEach(key => setAttribute(realNode,key,realNode.props[key]));
    // 开始套娃，套子节点
    vnode.children.forEach(child => this.render(child,realNode));
  }
  // 渲染到目标容器的子节点下
  const containerNode = container.appendChild(realNode);
  // 渲染之后执行回调函数
  callback && callback();
  return containerNode;
}

/**
 * react DOM属性是自己独有的，需要单独拿出来设置 
 */
function setAttribute(dom,key,value) {
  if(key === "className") {
    key = "class";
    if(value instanceof Array) value = value.join(" ");
  } else if (key === "class") {
    console.error("Use the className attribute name");
    return;
  }
  if (/on\w+/.test( key )){
    // react 中监听事件的名称是驼峰，这里统一转换成小写
    key = key.toLowerCase();
    // 动态给DOM元素绑定事件
    dom[key] = value;
  } else if(key === "style"){
    // style样式属性,在对象和字符串两种类型下的操作
    if(value && typeof value === "object"){
      Object.keys(value).forEach(styleKey => dom.style[styleKey] = typeof value[styleKey] === "number"?value[styleKey]+"px":value[styleKey])
    } else{
      dom.style.cssText = value || ""
    }
  } else{
    if ( value ) {
      dom.setAttribute( key, value );
    } else {
      dom.removeAttribute( key );
    }
  } 
}

export default ReactDom;