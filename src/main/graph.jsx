import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import Node from './node';
import Link from './link';
import { updateGraph, width, height, force } from './d3Util';
import _ from 'underscore';


class Graph extends Component {
  componentDidMount() {
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
    force.on('tick', () => {
      // after force calculation starts, call updateGraph
      // which uses d3 to manipulate the attributes,
      // and React doesn't have to go through lifecycle on each tick
      this.d3Graph.call(updateGraph);
    });
  }

  componentDidUpdate() {
    debugger
    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
    force.nodes(this.props.nodes).links(this.props.links);

    // start force calculations after
    // React has taken care of enter/exit of elements
    force.start();
  }

  render() {
    // use React to draw all the nodes, d3 calculates the x and y
    var nodes = _.map(this.props.nodes, (node) => {
      return (<Node data={node} key={node.key} />);
    });
    var links = _.map(this.props.links, (link) => {
      return (<Link key={link.key} data={link} />);
    });

    return (
      <svg width={width} height={height}>
        <g>
          {links}
          {nodes}
        </g>
      </svg>
    );
  }
}

export default Graph;
