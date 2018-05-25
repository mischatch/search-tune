import React, { Component } from 'react';
import { Search } from './search';
import { getNewToken } from '../secret';
import Graph from './graph';
import { isEqual, unionWith }  from 'lodash';
var _ = require('lodash');


class Main extends Component {
  constructor(props){
    super(props);

    // debugger
    this.state = {
      search: '',
      errors: '',
      nodes: [],
      width: window.innerWidth,
      height: window.innerHeight,
      links: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.addNewNodesAndLinks = this.addNewNodesAndLinks.bind(this);
    this.clearGraph = this.clearGraph.bind(this);
  }

  handleChange(e){
    e.preventDefault();
    this.setState({ search: e.target.value });
  }

  handleSubmit(e){
    e.preventDefault();
    if(this.state.search.trim() === ''){
      this.setState({ errors: 'Search field shouldn\'t be empty' });
    } else {
      getNewToken() // get new token first
      .then(token => {
        this.makeRequest(token);
      });
    }
  }

  makeRequest(token){
    const { search } = this.state;
    const request = new Request(`https://api.spotify.com/v1/search?q=${search}&type=Artist`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }),
    });
    fetch(request)
      .catch(err => {
        this.setState({ errors: err.message });
      })
      .then( res => {
        if(!res){
          this.setState({search: ''});
        } else if (res.status >= 400) {
          const message = `Status: ${res.status}, Error: ${res.statusText}`;
          this.setState({ errors: message });
        }
        return res.json();
      })
      .then(data => {
        if(data.error){
          this.setState({ errors: data.error.message });
        } else if ( data.artists.items.length === 0 ){
          this.setState({ errors: 'No artist was found by that name' });
        } else if (!data.error){
          const { name, images, id, genres, href } = data.artists.items[0];
          const artist = { name, id, images, genres, href };
          this.setState({ nodes: this.state.nodes.concat(artist) });
        }
      })
      .then(() => {
        this.setState({search: ''});
      });
  }

  showErrors(){
    return (
      this.state.errors === '' ? '' : <div>{this.state.errors}</div>
    );
  }

  addNewNodesAndLinks(nodes, links){
    this.setState({
      nodes: _.unionWith(this.state.nodes, nodes, _.isEqual),
      links: _.unionWith(this.state.links, links, _.isEqual),
    });
  }

  clearGraph(e){
    e.preventDefault();
    this.setState({ nodes: [], links: []});
  }



  render(){
    return (
      <div>
        <h1>Main</h1>
        <button onClick={this.clearGraph}>Clear</button>
        <Search
          handleChange={this.handleChange}
          submit={this.handleSubmit}
          searchState={this.state.search}
          />
        {this.showErrors()}
        <div>
          <Graph
            nodes={this.state.nodes}
            links={this.state.links}
            addNewNodesAndLinks={this.addNewNodesAndLinks}
            />
        </div>
      </div>
    );
  }
}

export default Main;
