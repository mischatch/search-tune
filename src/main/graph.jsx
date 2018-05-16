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


  componentDidMount() {
    // debugger
    this.nodeUpd(this.props.nodes, this.props.links);
  }
  //
  // componentWillMount(){
  //   debugger
  // }

  nodeUpd(nodes, links){
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
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
      debugger
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

  componentWillUnmount(){
    debugger
    this.nodeUpd(this.props.nodes, this.props.links);
  }


  componentWillUpdate(nextProps) {
    // debugger
    if(this.props.nodes.length !== nextProps.nodes.length){
      // debugger
      this.nodeUpd(nextProps.nodes, nextProps.links);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

    var d3Nodes = this.d3Graph.selectAll('.node')
      .data(nextProps.nodes);
      d3Nodes.enter().append('g').call(enterNode);
      d3Nodes.exit().remove();
      d3Nodes.call(updateNode);
      debugger

    var d3Links = this.d3Graph.selectAll('.link')
      .data(nextProps.links, (link) => link.key);
      d3Links.enter().insert('line', '.node').call(enterLink);
      d3Links.exit().remove();
      d3Links.call(updateLink);

      this.nodeUpd(nextProps.nodes, nextProps.links);
    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
    // force.nodes(nextProps.nodes).links(nextProps.links);
    // force.start();

    return false;
}

  // shouldComponentUpdate(newP) {
  //   if(this.props.nodes.length !== newP.nodes.length){
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    var nodes = _.map(this.props.nodes, (node, i) => {
      return (<Node data={node} key={i} addNewNodesAndLinks={this.props.addNewNodesAndLinks} />);
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
          {nodes}
        </g>
        <g>
          {links}
        </g>
      </svg>
    );
  }
}

export default Graph;
