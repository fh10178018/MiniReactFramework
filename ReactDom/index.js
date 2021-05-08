const ReactDom = {} 
/**
 * 将虚拟节点转换成真实节点，渲染到目标节点的子节点下
 */

ReactDom.render = function(vnode,container,callback){
  // 每一次render时，清空里面的内容
  container.innerHTML = '';
  // 获得渲染的真实节点
  const realNode = _render(vnode);
  const containerNode = container.appendChild(realNode);
  callback && callback()
  return containerNode;
}


function _render(vnode) {
  if ( typeof vnode.tag === 'function' ) {
    // 组件类，会直接返回一个函数给我们
    const component = createComponent( vnode.tag, vnode.attrs );
    setComponentProps( component, vnode.attrs );
    return component.base;
  }
  let realNode;
  if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';
  if (typeof vnode === "string" || typeof vnode === "number"){
    // 当为字符串时，直接创建文本节点
    realNode = document.createTextNode(String( vnode ));   
  } else {
    // 根据虚拟DOM创建真实DOM
    realNode = document.createElement(vnode.type);
    // 添加属性
    realNode.props && Object.keys(realNode.props).forEach(key => setAttribute(realNode,key,realNode.props[key]));
    // 开始套娃，套子节点
    vnode.children.forEach(child => render(child,realNode));
  }
  return realNode;
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