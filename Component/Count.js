import React from "React";
class Count extends React.Component{
  constructor( props ) {
    super(props);
    this.state = {num: 0}
  }
  componentDidMount(){
    this.setState({
      num:1
    })
  }
  render(){
    return(
      <strong>
        {this.state.num}
      </strong>
    )
  }
}
export default Count