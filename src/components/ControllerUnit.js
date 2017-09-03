import React from 'react';
require('styles/controller-unit.scss');

export default class ControllerUnit extends React.Component{

  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){

    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    let controllerUnitClassName = 'controller-unit';
    if(this.props.arrange.isCenter){
      controllerUnitClassName += ' is-center';

      if(this.props.arrange.isInverse){
        controllerUnitClassName += ' is-inverse';
      }

    }
    controllerUnitClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}
