// 该组件用来实验节点删除功能
import React from "React";
class Remove extends React.Component{
  constructor( props ) {
    super(props);
    this.state = {showContent: true}
  }
  handleDelete(){
    this.setState({
      showContent:!this.state.showContent
    })
  }
  handleAdd(){
    this.setState({
      showContent:true
    })
  }
  render(){
    return (
      <div>
        {
          this.state.showContent?
            <div id="observe1">观察节点</div>:
            ''
        }
        <button onClick={this.handleDelete.bind(this)}>{this.state.showContent?'删除':'回复内容'}</button>
        <button onClick={this.handleAdd.bind(this)}>恢复内容</button>
      </div>
    );
  }
}
export default Remove