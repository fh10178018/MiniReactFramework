// dom为真实的dom,vnode为虚拟节点
function diff(dom,vnode) {
  var out;
  // 如果只是简单文本类型  
  // diff text node
  if ( typeof vnode === 'string' ) {
    // 如果当前的DOM就是文本节点，则直接更新内容
    if ( dom && dom.nodeType === 3 ) {    // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
        if ( dom.textContent !== vnode ) {
            dom.textContent = vnode;
        }
    // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
    } else {
        out = document.createTextNode( vnode );
        if ( dom && dom.parentNode ) {
            dom.parentNode.replaceChild( out, dom );
        }
    }
    return out;
  }
  if(!dom || dom.nodeName.toLowerCase() !== vnode.type.toLowerCase()){ // 对比节点信息
    out = document.createElement( vnode.type );
    if ( dom ) {
        [ ...dom.childNodes ].map( out.appendChild );    // 将原来的子节点移到新节点下
        if ( dom.parentNode ) {
            dom.parentNode.replaceChild( out, dom );    // 移除掉原来的DOM对象
        }
    }
  }
  if ( vnode.children && vnode.children.length > 0 || ( out.childNodes && out.childNodes.length > 0 ) ) {
    diffChildren( out, vnode.children );
  }
  console.log(out,dom,vnode)
  return out
}

function diffChildren( dom, vchildren ) {

  const domChildren = dom.childNodes;
  const children = [];

  const keyed = {};

  // 将有key的节点和没有key的节点分开
  if ( domChildren.length > 0 ) {
      for ( let i = 0; i < domChildren.length; i++ ) {
          const child = domChildren[ i ];
          const key = child.key;
          if ( key ) {
              keyed[ key ] = child;
          } else {
              children.push( child );
          }
      }
  }

  if ( vchildren && vchildren.length > 0 ) {

      let min = 0;
      let childrenLen = children.length;

      for ( let i = 0; i < vchildren.length; i++ ) {

          const vchild = vchildren[ i ];
          const key = vchild.key;
          let child;

          // 如果有key，找到对应key值的节点
          if ( key ) {

              if ( keyed[ key ] ) {
                  child = keyed[ key ];
                  keyed[ key ] = undefined;
              }

          // 如果没有key，则优先找类型相同的节点
          } else if ( min < childrenLen ) {

              for ( let j = min; j < childrenLen; j++ ) {

                  let c = children[ j ];

                  if ( c && isSameNodeType( c, vchild ) ) {

                      child = c;
                      children[ j ] = undefined;

                      if ( j === childrenLen - 1 ) childrenLen--;
                      if ( j === min ) min++;
                      break;

                  }

              }

          }

          // 对比
          child = diff( child, vchild );

          // 更新DOM
          const f = domChildren[ i ];
          if ( child && child !== dom && child !== f ) {
              // 如果更新前的对应位置为空，说明此节点是新增的
              if ( !f ) {
                  dom.appendChild(child);
              // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
              } else if ( child === f.nextSibling ) {
                  removeNode( f );
             // 将更新后的节点移动到正确的位置
              } else {
                  // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                  dom.insertBefore( child, f );
              }
          }

      }
  }

}

export default diff