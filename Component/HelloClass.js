// 该组件用来实验节点文本更新功能
import React from "React";
class HelloClass extends React.Component{
  constructor( props ) {
    super(props);
  }
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: this.timestampToTime(new Date().getTime())}), 1000);
  } 
  componentWillUnmount() {
      clearInterval(this.interval);
  }
  timestampToTime(timestamp) {
    var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
 
    let strDate = Y + M + D + h + m + s;
    return strDate;
  }
  render(){
    return (
      <div>
        <strong>{this.props.title}</strong>
        <p>{this.state.time}</p> 
      </div>
    );
  }
}
export default HelloClass