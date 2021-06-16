import React from "../React/index"
// 该方法用于初始挂在渲染
export function render(virtualNode,container,callback) {
  const realNode = _render(undefined,virtualNode,container); // 统一diffRender进行渲染，这里的dom为undefined,在diffrender中就是直接添加
  callback && callback()
  return realNode;
}

function _render( dom, vnode, container ) {
  const ret = diffNode( dom, vnode );
  if ( container && ret.parentNode !== container ) {
      container.appendChild( ret );
  }
  return ret;
}

// 注意更新节点的本质就是对节点的更新或对内部节点内容的更新
// diffNode函数基本上不修改节点，他会返回一个新的diffNode，用来操作
// 但是如果文本节点的更改都是发生在diffNode中
function diffNode(realNode,virtualNode) {
  let diffRes = realNode;
  if (virtualNode === undefined || virtualNode === null || typeof virtualNode === "boolean") virtualNode = "";

  // virtualNode属于文本节点时
  if (typeof virtualNode === "string" || typeof virtualNode === "number"){
    if(realNode && realNode.nodeType === 3) {
      // 节点内容发生变化
      if (realNode.textContent !== virtualNode) {
        realNode.textContent = virtualNode;
      }
    } else { // 替换的节点不是文本类型，或者不存在时
      // 创建一个新的节点
      diffRes = document.createTextNode(String( virtualNode ));
      if(realNode && realNode.parentNode){ // 如果是文本更新场景，则将新建的节点替换
        realNode.parentNode.replaceChild(diffRes,realNode)
      }
    }
    return diffRes
  }

  // virtualNode属于function组件
  if ( typeof virtualNode.type === 'function' ) {
    // 之前的组件更新，你会发现效率不高，这里做一下判断
    return diffComponent( realNode, virtualNode );
  }

  if ( !realNode || !isSameNodeType( realNode, virtualNode ) ) {
    diffRes = document.createElement( virtualNode.type );
    if ( realNode ) {
        [ ...realNode.childNodes ].forEach(item => diffRes.appendChild(item) );    // 将原来的子节点移到新节点下
        if ( realNode.parentNode ) {
          realNode.parentNode.replaceChild( diffRes, realNode );    // 移除掉原来的DOM对象
        }
    }
  }

  // virtualNode属于由createElment生成的虚拟节点
  // // 创造组件对象
  // realNode = document.createElement(virtualNode.type);
  // // 添加属性
  // virtualNode.props && Object.keys(virtualNode.props).forEach(key => setAttribute(realNode,key,virtualNode.props[key]));
  // // 开始套娃，套子节点
  // virtualNode.children.forEach(child => render(child,realNode));
  
  // 以上过程是虚拟节点的更换过程但是不具有diff比对效果，所以重新修改

  // 添加属性
  diffAttributes(diffRes,virtualNode)
  // virtualNode.props && Object.keys(virtualNode.props).forEach(key => setAttribute(diffRes,key, virtualNode.props[key]));
  // 开始套娃，套子节点
  if ( virtualNode.children && virtualNode.children.length > 0 || ( diffRes.childNodes && diffRes.childNodes.length > 0 ) ) {
    diffChildrenRender(diffRes,virtualNode.children)
  }

  // virtualNode.children.forEach(child => render(child,diffRes));
  return diffRes;
}

function diffChildrenRender(dom,vChildren) {
  const rChildren = dom.childNodes;
  vChildren.forEach((vChild,index) => {
    let rChild = rChildren[index];
    const diffChild = diffNode( rChild, vChild );
    if ( diffChild && diffChild !== dom && diffChild !== rChild ) {
      if ( !rChild ) {
          dom.appendChild( diffChild );
      } else if ( diffChild === rChild.nextSibling ) {
          removeNode( rChild );
      } else {
        dom.insertBefore( diffChild, rChildren[index] );
      }
    }
  })
}

function diffComponent( dom, vnode ) {
  let c = dom && dom._component;
  let oldDom = dom;
  // 如果组件类型没有变化，则重新set props
  if ( c && c.constructor === vnode.type ) {
    setComponentProps( c, vnode.props );
    renderComponent(c)
    return c.base;
  // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  } else {
    if ( c ) {
      unmountComponent( c );
      oldDom = null;
    }
    c = createComponent( vnode.type, vnode.props );
    setComponentProps( c, vnode.props );
    renderComponent(c)
    return c.base;
    // if ( oldDom && dom !== oldDom ) {
    //     oldDom._component = null;
    //     removeNode( oldDom );
    // }
  }
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
}

export function renderComponent( component ) {
  let base = {};
  const renderer = component.render();
  if ( component.base && component.componentWillUpdate ) {
    // 组件将要更新
    component.componentWillUpdate();
  }
  const replaceNode = diffNode(component.base,renderer);
  // const replaceNode = _render( renderer );
  // 组件没有挂载更新之前，但已经通过render生成真实DOM元素
  if ( component.base ) {
    if ( component.componentDidUpdate ) component.componentDidUpdate();
  } else if ( component.componentDidMount ) {
    component.componentDidMount();
  }
  // // 找到父节点，通过父节点更新节点
  // if ( component.base && component.base.parentNode ) {
  //   component.base.parentNode.replaceChild( replaceNode, component.base );
  // }
  // 用 component.base 保存已经更新的节点元素
  component.base = replaceNode;
  // 形成闭环
  base._component = component;
}

function isSameNodeType( dom, vnode ) {
  if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
      return dom.nodeType === 3;
  }

  if ( typeof vnode.type === 'string' ) {
      return dom.nodeName.toLowerCase() === vnode.type.toLowerCase();
  }

  return dom && dom._component && dom._component.constructor === vnode.type;
}

// 
function diffAttributes( dom, vnode ) {
  const old = {};    // 当前DOM的属性
  const attrs = vnode.props;     // 虚拟DOM的属性
  for ( let i = 0; i < dom.attributes.length; i++ ) {
      const attr = dom.attributes[ i ];
      old[ attr.name ] = attr.value;
  }
  // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
  for ( const name in old ) {

      if ( !( name in attrs ) ) {
          setAttribute( dom, name, undefined );
      }

  }

  // 更新新的属性值
  for ( const name in attrs ) {

      if ( old[ name ] !== attrs[ name ] ) {
          setAttribute( dom, name, attrs[ name ] );
      }

  }

}

document.addEventListener("DOMSubtreeModified", function(e){
  console.log(`本次修改位置：${e.srcElement}，修改内容：${e.target}`);
}, false);