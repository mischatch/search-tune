import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import Node from './node';
import Link from './link';
import { updateGraph, width, height, force, enterNode, updateNode, updateLink, enterLink } from './d3Util';
import _ from 'underscore';


class Graph extends Component {
  constructor(props){
    super(props);

    this.nodeUpd = this.nodeUpd.bind(this);
  }


  // componentDidMount() {
  //   debugger
  //   this.nodeUpd(this.props.nodes, this.props.links);
  // }

  nodeUpd(nodes, links){
    // debugger
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.container));
    // this.d3Graph = d3.select('svg');

    var force = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-300).distanceMin(20))
      .force("link",  d3.forceLink(links).id((d) => d.id).distance(30).strength(0.1).iterations(1))
      .force("center", d3.forceCenter().x(width / 2).y(height / 2))
      .force("collision", d3.forceCollide(75))
      .force("collide", d3.forceCollide([5]).iterations([5]).radius([60]));

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
      // debugger
      const node = this.d3Graph.selectAll('g.node')
        .call(d3.drag()
                  .on("start", dragStarted)
                  .on("drag", dragging)
                  .on("end", dragEnded)
             );

      force.on('tick', () => {
          this.d3Graph.call(updateGraph);
      });
      window.node = node;
      console.log(node.nodes());
  }


  componentWillReceiveProps(nextProps) {
    let update = this.props.nodes.length !== nextProps.nodes.length ||
                 this.props.links.length !== nextProps.links.length;
    if(update){
      this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.container));
      // debugger
      let d3Nodes = this.d3Graph.selectAll('node')
      .data(nextProps.nodes)
      .enter().append('g').call(enterNode)
      .exit().remove()
      .call(updateNode);
      console.log(d3Nodes);
      // debugger

      let d3Links = this.d3Graph.selectAll('.link')
      .data(nextProps.links)
      .enter().insert('line', 'svg').call(enterLink)
      .exit().remove()
      .call(updateLink);

      this.nodeUpd(nextProps.nodes, nextProps.links);
    }

}


  render() {
    // debugger
    var nodes = _.map(this.props.nodes, (node, i) => {
      return (<Node data={node} key={i} addNewNodesAndLinks={this.props.addNewNodesAndLinks} />);
    });
    var links = _.map(this.props.links, (link, i) => {
      return (<Link data={link} key={i} />);
    });


    return (
      <svg
        ref='container'
        width={width}
        height={height}
        style={{"border": "2px solid black", "margin": "20px"}}>

          {nodes}


          {links}

      </svg>
    );
  }
}

export default Graph;
