import { renderComponent } from '../ReactDom/render'

const setStateQueue = [];
const renderQueue = [];


export function enqueueSetState( stateChange, component ) {
  // 如果queue的长度是0，也就是在上次flush执行之后第一次往队列里添加
  if ( setStateQueue.length === 0 ) {
    Promise.resolve().then( flush );
  }
  setStateQueue.push({
    stateChange,
    component
  });

  if ( !renderQueue.some( item => item === component ) ) {
      renderQueue.push( component );
  }
}

function flush() {
    let item, component;
    while( item = setStateQueue.shift() ) {

        const { stateChange, component } = item;

        // 如果没有prevState，则将当前的state作为初始的prevState
        if ( !component.prevState ) {
            component.prevState = Object.assign( {}, component.state );
        }

        // 如果stateChange是一个方法，也就是setState的第二种形式
        if ( typeof stateChange === 'function' ) {
            Object.assign( component.state, stateChange( component.prevState, component.props ) );
        } else {
            // 如果stateChange是一个对象，则直接合并到setState中
            Object.assign( component.state, stateChange );
        }

        component.prevState = component.state;

    }
    // 这样在一次“事件循环“中，最多只会执行一次flush了，在这个“事件循环”中，所有的setState都会被合并，并只渲染一次组件。
    while( component = renderQueue.shift() ) {
        renderComponent( component );
    }

}
