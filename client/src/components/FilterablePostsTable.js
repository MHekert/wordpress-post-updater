import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import PostsList from './PostsList';

class FilterablePostsTable extends React.Component {

  render() {
      const data = {
        "posts": this.props.data.posts,
        "filterText": this.props.data.filterText,
        "filterAuthor": this.props.data.filterAuthor,
        // "filterAuthor": {id: 4},
        "filterCategory": this.props.data.filterCategory,
        "isCompletePostsList": this.props.data.isCompletePostsList,
        "currentAuthor": this.props.data.currentAuthor,
        "currentPost": this.props.data.currentPost
      }
      return (
        <PostsList data={data}></PostsList>
      );
    }
  }

  export default FilterablePostsTable;
