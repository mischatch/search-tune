import React, { Component } from 'react';
import { Search } from './search';
import { getNewToken } from '../secret';
import _ from 'lodash';
import Node from './node';
import Graph from './graph';
import { enterNode, updateNode, enterLink, updateLink,
          updateGraph, width, height, force } from './d3Util';


class Main extends Component {
  constructor(props){
    super(props);

    // debugger
    this.state = {
      search: '',
      errors: '',
      result: [],
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // this.res = {
    //   name: 'somename',
    //   images: ['img1', 'img2', 'img3'],
    //   id: 'dgzhslisubyfdgp9ae',
    //   genres: ['techno', 'idm', 'electronic'],
    //   href: 'https://www.someaddress.com'
    // };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reqTok = this.reqTok.bind(this);
  }

  // componentDidMount() {
  //   this.updateData();
  // }


  handleChange(e){
    e.preventDefault();
    this.setState({ search: e.target.value });
  }

  async reqTok(){
    const result = await getNewToken();
    return result;
  }

  async handleSubmit(e){
    const { search } = this.state;
    let token = await this.reqTok();
    const request = new Request(`https://api.spotify.com/v1/search?q=${search}&type=Artist`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
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

        debugger
        const { name, images, id, genres, href } = data.artists.items[0];
        const x = 0, y = 0, r = 10;
        const artist = { name, images, id, genres, href, x, y, r };
        this.setState({ result: this.state.result.concat(artist) });
      });
      e.preventDefault();
  }

  showErrors(){
    return (
      this.state.errors === '' ? '' : <div>{this.state.errors}</div>
    );
  }


  render(){
    debugger
    const nodeCount = 2 ; //this.state.result.length;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
      	r: 25,
        x: Math.random() * (this.state.width),
        y: Math.random() * (this.state.height)
      });
    }
    const links = [];
      for (let i = 0; i < nodeCount; i++) {
        let target = 0;
        do {
          target = Math.floor(Math.random() * nodeCount);
        } while (target === i) {
          links.push({
            source: i,
            target
          });
        }
      }

    return (
      <div>
        <h1>Main</h1>
        <Search
          handleChange={this.handleChange}
          submit={this.handleSubmit}
          searchState={this.state.search}
          />
        {this.showErrors()}
        <div>

          <Graph nodes={this.state.nodes} links={this.state.links} />
        </div>
      </div>
    );
  }

}
// links={links}

// Nodes.defaultProps = {
//   width: 300,
//   height: 300,
//   forceStrength: -10
// };

export default Main;
