import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import PostsList from './PostsList';
import FilterForm from './FilterForm';

class FilterablePostsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      filterText: '',
      filterAuthorId: -1,
      filterCategoryId: -1
    };
    // this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
    this.handleFilterCategoryChange = this.handleFilterCategoryChange.bind(this);
  }

  handleFilterAuthorChange(newAuthor) {
    this.setState({
      filterAuthorId: newAuthor
    });
  }

  handleFilterCategoryChange(newCategory) {
    this.setState({
      filterCategoryId: newCategory
    });
  }



  render() {
    const data = {
      "posts": this.props.data.posts,
      // "filterText": this.props.data.filterText,
      // "filterCategory": this.props.data.filterCategory,
      "isCompletePostsList": this.props.data.isCompletePostsList,
      "currentAuthor": this.props.data.currentAuthor,
      "currentPost": this.props.data.currentPost
    }
    const authors = this.props.data.authors;
    const categories = this.props.data.categories;
    const filterAuthorId = this.state.filterAuthorId;
    const filterCategoryId = this.state.filterCategoryId;
    console.log(filterAuthorId);
    return (
      <React.Fragment>
        <FilterForm handleFilterAuthorChange={this.handleFilterAuthorChange} handleFilterCategoryChange={this.handleFilterCategoryChange} data={data} authors={authors} categories={categories}></FilterForm>
        <PostsList data={data} filterAuthorId={filterAuthorId} filterCategoryId={filterCategoryId}></PostsList>
      </React.Fragment>
    );
  }
}

export default FilterablePostsTable;
