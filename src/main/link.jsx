import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import { enterNode, updateNode, enterLink, updateLink,
          updateGraph, width, height, force } from './d3Util';

class Link extends Component{
  componentDidMount() {
    this.d3Link = d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterLink);
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
