import React from "../React/index"
/**
 * 将虚拟节点转换成真实节点，渲染到目标节点的子节点下
 */

function render (vnode,container,callback){
  // 每一次render时，清空里面的内容
  container.innerHTML = '';
  // 获得渲染的真实节点
  const realNode = _render(vnode);
  const containerNode = container.appendChild(realNode);
  callback && callback()
  return containerNode;
}


function _render(vnode) {
  if ( typeof vnode.type === 'function' ) {
    // transform-react-jsx插件翻译组件，会直接返回一个函数给我们
    const component = createComponent( vnode.type, vnode.props );
    setComponentProps( component, vnode.props );
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
    vnode.props && Object.keys(vnode.props).forEach(key => setAttribute(realNode,key,vnode.props[key]));
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

/**
 * react组件渲染周期部分
 */
// 创建组件的时候
function createComponent(component, props){
  let inst;
  // 如果是类定义组件，直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    inst = new React.Component(props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    }
  }
  return inst
}

// 组件数据初始化
function setComponentProps( component, props ) {
  if ( !component.base ) {
    // 组件将要挂载的时候，也就是组件第一次生成
    if ( component.componentWillMount ) component.componentWillMount();
  } else if ( component.componentWillReceiveProps ) {
    // 这里指的是，组件props的值发生变化，从而更新组件
    component.componentWillReceiveProps( props );
  }
  component.props = props;
  // 数据初始化完成，开始渲染数据
  renderComponent( component );
}

export function renderComponent( component ) {
  let base;
  const renderer = component.render();
  if ( component.base && component.componentWillUpdate ) {
    // 组件将要更新
    component.componentWillUpdate();
  }
  replaceNode = _render( renderer );
  // 组件没有挂载更新之前，但已经通过render生成真实DOM元素
  if ( component.base ) {
    if ( component.componentDidUpdate ) component.componentDidUpdate();
  } else if ( component.componentDidMount ) {
    component.componentDidMount();
  }
  // 找到父节点，通过父节点更新节点
  if ( component.base && component.base.parentNode ) {
    component.base.parentNode.replaceChild( replaceNode, component.base );
  }
  // 用 component.base 保存已经更新的节点元素
  component.base = replaceNode;
  // 形成闭环
  base._component = component;
}

export default {
  render
};