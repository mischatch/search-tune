import React, { Component } from 'react';
import { Search } from './search';
import { token } from '../secret';

class Main extends Component {
  constructor(props){
    super(props);

    this.state = {
      search: '',
      errors: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    e.preventDefault();
    this.setState({ search: e.target.value });
  }

  handleSubmit(e){
    const { search } = this.state;
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
          debugger
          const message = `Status: ${res.status}, Error: ${res.statusText}`;
          this.setState({ errors: message });
        }
        return res.json();
      })
      .then(data => {
      });
      e.preventDefault();
  }

  showErrors(){
    return (
      this.state.errors === '' ? '' : <div>{this.state.errors}</div>

    )
  }

  render(){
    return (
      <div>
        <h1>Main</h1>
        <Search
          handleChange={this.handleChange}
          submit={this.handleSubmit}
          searchState={this.state.search}
          />
        {this.showErrors()}
      </div>
    );
  }

}

export default Main;
