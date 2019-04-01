import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';

class Container extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      posts: [],
      authors: [],
      filterAuthor: '',
      filterTerm: ''
    };
    // this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    // this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
    // this.handleFilterTermChange = this.handleFilterTermChange.bind(this);
    this.retrivePosts = this.retrivePosts.bind(this);
    // this.retriveAuthors = this.retriveAuthors.bind(this);

    this.setPosts = this.setPosts.bind(this);
  }

  componentDidMount() {
    this.setPosts(this.state.posts, this.retrivePosts);
    console.log('tessssst');
    setTimeout(() => {
      console.log('timeout!!!!');
      this.setPosts(this.state.posts, this.retrivePosts);
    },5000)
  }

  retrivePosts(postsPage) {
    let postsPromise = new Promise((resolve, reject) => {
      fetch(`http://www.localhost:8081/posts/${postsPage}`)
      .then(response => response.json())
      .then((jsonData) => {
        resolve(jsonData);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
    });
    return postsPromise;
  }

  setPosts(actualPosts, retrivePosts) {
    let whichPage = Math.floor(actualPosts.length / sharedConfig.postsPerPage) + 1;
    console.log(whichPage);
    retrivePosts(whichPage).then(
      (newPosts) => {
        //change to append
        let tmpPosts = [];
        tmpPosts = tmpPosts.concat(actualPosts,newPosts);
        this.setState({
          posts: tmpPosts
        });
      },
      (error) => {
          console.log(error);
      }
    );  
  }
  
  

  render() {
    const posts = this.state.posts
    console.log();
    let arr = [];
    if (posts !== undefined)
      posts.forEach((element) => {
        console.log(element);
        arr.push(<li key={element.id}>{element.title.rendered}</li>);
      });

      return (
        <ul>
          {arr}
        </ul>
      );
    }
  }

  export default Container;
