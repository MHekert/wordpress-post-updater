import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import FilterablePostsTable from './FilterablePostsTable';

class Container extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      posts: [],
      authors: [],
      categories: [],
      filterAuthor: '',
      filterCategory: '',
      isCompletePostsList: false,
      currentAuthor: {} //for later use
    };
    // this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    // this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
    // this.handleFilterTermChange = this.handleFilterTermChange.bind(this);
    this.retrievePosts = this.retrievePosts.bind(this);
    this.retrieveAuthors = this.retrieveAuthors.bind(this);
    this.retrieveCategories = this.retrieveCategories.bind(this);

    this.setPosts = this.setPosts.bind(this);
    this.setAuthors = this.setAuthors.bind(this);
    this.setCategories = this.setCategories.bind(this);
  }

  componentDidMount() {
    this.setPosts(this.state.posts, this.retrievePosts);
    this.setAuthors(this.state.authors, this.retrieveAuthors);
    this.setCategories(this.state.categories, this.retrieveCategories);
  }

  retrievePosts(postsPage) {
    let postsPromise = new Promise((resolve, reject) => {
      fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/posts/${postsPage}`)
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

  retrieveAuthors() {
    //TODO combine with retrieveCategories ??
    let authorsPromise = new Promise((resolve, reject) => {
      fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/authors`)
      .then(response => response.json())
      .then((jsonData) => {
        resolve(jsonData);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
    });
    return authorsPromise;
  }

  retrieveCategories() {
    //TODO combine with retrieveAuthors ??
    let categoriesPromise = new Promise((resolve, reject) => {
      fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/categories`)
      .then(response => response.json())
      .then((jsonData) => {
        resolve(jsonData);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
    });
    return categoriesPromise;
  }

  setPosts(actualPosts, retrievePosts) {
    let whichPage = Math.floor(actualPosts.length / sharedConfig.postsPerPage) + 1;
    retrievePosts(whichPage).then(
      (newPosts) => {
        if (newPosts.code === undefined) {
          let tmpPosts = [];
          tmpPosts = tmpPosts.concat(actualPosts,newPosts);
          this.setState({
            posts: tmpPosts
          });
        } else {
          this.setState({
            isCompletePostsList: true
          });
        }
      },
      (error) => {
          console.log(error);
      }
    );  
  }
  

  setAuthors(actualAuthors, retrieveAuthors) {
    //TODO combine with setCategories ??
    retrieveAuthors().then(
      (newAuthors) => {
        this.setState({
          authors: newAuthors
        });
      },
      (error) => {
          console.log(error);
      }
    );  
  }

  setCategories(actualAuthors, retrieveCategories) {
    //TODO combine with setAuthors ??
    retrieveCategories().then(
      (newCategories) => {
        this.setState({
          categories: newCategories
        });
      },
      (error) => {
          console.log(error);
      }
    );  
  }
  

  render() {
      return (
        <>
          <FilterablePostsTable data={this.state}></FilterablePostsTable>
        </>
      );
    }
  }

  export default Container;
