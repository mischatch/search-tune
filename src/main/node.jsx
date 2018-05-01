import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import { enterNode, updateNode, enterLink, updateLink,
          updateGraph, width, height, force } from './d3Util';

class Node extends Component {
  componentDidMount() {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterNode);
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(updateNode);
  }

  render() {
    return (
      <g className='node'>
        <circle/>
        <text>{this.props.data.key}</text>
      </g>
    );
  }
}

export default Node;
