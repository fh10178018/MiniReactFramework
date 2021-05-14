import React from "React";
class HelloClass extends React.Component{
  constructor( props ) {
    super(props);
  }
  render(){
    return (
      <strong>{this.props.name}</strong>
    );
  }
}
export default HelloClass