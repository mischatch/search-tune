import React, { Component } from 'react';
import { Search } from './search';
import { getNewToken } from '../secret';
import _ from 'lodash';
import Nodes from './nodes';


class Main extends Component {
  constructor(props){
    super(props);

    // debugger
    this.state = {
      search: '',
      errors: '',
      result: {},
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
    debugger
    const request = new Request(`https://api.spotify.com/v1/search?q=${search}&type=Artist`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    });
    debugger
    fetch(request)
      .then( res => {
        if (res.status >= 400) {
          const message = `Status: ${res.status}, Error: ${res.statusText}`;
          this.setState({ errors: message });
        }
        return res.json();
      })
      .then(data => {

        const { name, images, id, genres, href } = data.artists.items[0];
        const artist = { name, images, id, genres, href };
        this.setState({ result: artist });
      });
      e.preventDefault();
  }

  showErrors(){
    return (
      this.state.errors === '' ? '' : <div>{this.state.errors}</div>
    );
  }
  show(){
    return (
      _.isEmpty(this.state.result) ? '' : <ul><li>{this.state.result.name}</li></ul>
    );
  }

  render(){
    debugger
    const nodeCount = 100;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
      	r: (Math.random() * 5 ) + 2,
        x: 0,
        y: 0
      });
    }
    const links = [];
      for (let i = 0; i < nodeCount; i++) {
        let target = 0;
        do {
          target = Math.floor(Math.random() * nodeCount);
        } while(target === i) {
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
        {this.show()}
        <Nodes
          nodes={nodes}
          links={links}
          width={this.state.width}
          height={this.state.height}
          forceStrength={-10}
          linkDistance={30}
          />
      </div>
    );
  }

}

// Nodes.defaultProps = {
//   width: 300,
//   height: 300,
//   forceStrength: -10
// };

export default Main;
