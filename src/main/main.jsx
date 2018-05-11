import React, { Component } from 'react';
import { Search } from './search';
import { getNewToken } from '../secret';
import Graph from './graph';


class Main extends Component {
  constructor(props){
    super(props);

    // debugger
    this.state = {
      search: '',
      errors: '',
      result: [
                // {"name": "name1", "id": 1, images: [], genres: [], href: '' },
                // {"name": "name2", "id": 2, images: [], genres: [], href: '' }
              ],
      width: window.innerWidth,
      height: window.innerHeight,
      nodes:
        [
          {"name": "fruit", "id": 1},
          {"name": "apple", "id": 2},
          {"name": "orange", "id": 3},
          {"name": "banana", "id": 4},
        ],
      links:
        [
          // {"source": 1, "target": 2},
          // {"source": 1, "target": 3},
        ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.addOne = this.addOne.bind(this);
    this.addNewNodesAndLinks = this.addNewNodesAndLinks.bind(this);
  }

  handleChange(e){
    e.preventDefault();
    this.setState({ search: e.target.value });
  }

  handleSubmit(e){
    e.preventDefault();
    getNewToken() // get new token first
      .then(token => {
        this.makeRequest(token);
      });
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
        debugger
        this.setState({ errors: err.message });
      })
      .then( res => {
        if (res.status >= 400) {
          const message = `Status: ${res.status}, Error: ${res.statusText}`;
          this.setState({ errors: message });
        }
        return res.json();
      })
      .then(data => {
        if ( data.artists.items.length === 0 ){
          this.setState({ errors: 'No artist was found by that name' });
        } else if (!data.error){
          const { name, images, id, genres, href } = data.artists.items[0];
          const artist = { name, id, images, genres, href };
          this.setState({ result: this.state.result.concat(artist) });
        } else {
          this.setState({ errors: data.error.message });
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

  addOne(){
    let last = this.state.result[this.state.result.length - 1].id;
    let obj = {"name": `name${last + 1}`, "id": last + 1, images: [], genres: [], href: '' };
    this.setState({result: this.state.result.concat(obj)});
  }

  addNewNodesAndLinks(nodes, links){
    debugger
    this.setState({
      result: this.state.result.concat(nodes),
      links: this.state.links.concat(links)
    });
  }



  render(){
    return (
      <div>
        <h1>Main</h1>
        <button onClick={this.addOne}>one more</button>
        <Search
          handleChange={this.handleChange}
          submit={this.handleSubmit}
          searchState={this.state.search}
          />
        {this.showErrors()}
        <div>
          <Graph
            nodes={this.state.result}
            links={this.state.links}
            addNewNodesAndLinks={this.addNewNodesAndLinks}
            />
        </div>
      </div>
    );
  }
}

export default Main;
