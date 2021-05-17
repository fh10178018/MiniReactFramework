import React from "React";
class HelloClass extends React.Component{
  constructor( props ) {
    super(props);
  }
  render(){
    return (
      <strong>{this.props.title}</strong>
    );
  }
}
export default HelloClass