import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import { enterLink, updateLink } from './d3Util';

class Link extends Component{
  componentDidMount() {
    this.d3Link = d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterLink);
  }

  shouldComponentUpdate(comp){
    debugger
  }

  componentDidUpdate() {
    this.d3Link.datum(this.props.data)
      .call(updateLink);
  }

  render() {
    return (<line className='link' />);
  }
}

export default Link;
