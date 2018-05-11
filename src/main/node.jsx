import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";
import { enterNode, updateNode } from './d3Util';
import { getNewToken } from '../secret';
// import { isEqual, unionWith }  from 'lodash';
var _ = require('lodash');



class Node extends Component {
  constructor(props){
    super(props);

    this.state = {
      nodes: [],
      errors: '',
      links: [],
    };

    this.makeRequest = this.makeRequest.bind(this);
    this.handle = this.handle.bind(this);
  }

  componentDidMount() {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterNode);
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(updateNode);
  }

  handle(e){
    e.preventDefault();
    getNewToken() // get new token first
      .then(token => {
        this.makeRequest(token);
      });
  }


  makeRequest(token){
    const search = this.props.data.id;
    const request = new Request(`https://api.spotify.com/v1/artists/${search}/related-artists`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }),
    });

    fetch(request)
      .then( res => {
        if (res.status >= 400) {
          const message = `Status: ${res.status}, Error: ${res.statusText}`;
          this.setState({ errors: message });
        }
        return res.json();
      })
      .then(data => {
        let artists = data.artists.slice(0, 5);
        let links = [];
        let newResult = artists.map(art => {
          const { name, images, id, genres, href } = art;
          const artist = { name, id, images, genres, href };
          const link = { source: this.props.data.id, target: id };
          links.push(link);
          return artist;
        });
        var newNodes = this.state.nodes.concat(newResult);
        this.setState({
          nodes: _.unionWith(newNodes, _.isEqual),
          links: _.unionWith(this.state.links, links, _.isEqual),
        });
      })
      .then(() => {
        const { nodes, links } = this.state;
        this.props.addNewNodesAndLinks(nodes, links);
      });
  }

  render() {
    return (
      <g className='node'>
        <circle onClick={this.handle.bind(this)}/>
        <text>{this.props.data.name}</text>
      </g>
    );
  }
}

export default Node;
