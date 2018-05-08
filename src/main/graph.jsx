import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import Node from './node';
import Link from './link';
import { updateGraph, width, height, force } from './d3Util';
import _ from 'underscore';


class Graph extends Component {
  constructor(props){
    super(props);

    this.nodeUpd = this.nodeUpd.bind(this);
  }


  componentDidMount() {
    this.nodeUpd(this.props.nodes);
  }

  nodeUpd(nodes){
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
    var force = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink(this.props.links).distance(90))
      .force("center", d3.forceCenter().x(width / 2).y(height / 2))
      .force("collide", d3.forceCollide([5]).iterations([5]));

      function dragStarted(d) {
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragEnded(d) {
        if (!d3.event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      const node = d3.selectAll('g.node')
        .call(d3.drag()
                  .on("start", dragStarted)
                  .on("drag", dragging)
                  .on("end", dragEnded)
             );

        force.on('tick', () => {
            this.d3Graph.call(updateGraph);
        });
  }


  componentWillUpdate(nextProps) {
    // debugger
    if(this.props.nodes.length !== nextProps.nodes.length){
      this.nodeUpd(nextProps.nodes);
    }
  }

  shouldComponentUpdate(newP) {
    if(this.props.nodes.length !== newP.nodes.length){
      return true;
    }
    return false;
  }

  render() {
    var nodes = _.map(this.props.nodes, (node, i) => {
      return (<Node data={node} key={i} />);
    });
    var links = _.map(this.props.links, (link, i) => {
      return (<Link data={link} key={i} />);
    });

    return (
      <svg
        width={width}
        height={height}
        style={{"border": "2px solid black", "margin": "20px"}}>
        <g>
          {links}
        </g>
        <g>
          {nodes}
        </g>
      </svg>
    );
  }
}

export default Graph;
