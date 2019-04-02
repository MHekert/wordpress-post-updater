import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';

class FilterablePostsTable extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
  
  }

  

  render() {
    console.log(this.props);
    const posts = this.props.data.posts;
    const authors = this.props.data.authors;
    let arrPosts = [];
    if (posts !== undefined) {
      posts.forEach((element) => {
        arrPosts.push(<li key={element.id}>{element.title.rendered}</li>);
      });
    }
    let arrAuthors = [];
    if (authors !== undefined) {
      authors.forEach((element) => {
        arrAuthors.push(<li key={element.id}>{element.name}</li>);
      });
    }

      return (
        <>
          <ul>
            {arrAuthors}
          </ul>
          <ul>
            {arrPosts}
          </ul>
        </>
      );
    }
  }

  export default FilterablePostsTable;
