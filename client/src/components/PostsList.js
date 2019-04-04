import React, { Component } from 'react';


class PostsList extends React.Component {

  render() {
    let filteredPosts = this.props.data.posts;
    const filterAuthorId = this.props.filterAuthorId;
    const filterCategoryId = this.props.filterCategoryId;
    console.log(filterAuthorId);

    if (filteredPosts !== undefined && filterAuthorId !== undefined ) {
      filteredPosts = filteredPosts.filter( post => filterAuthorId == -1 ? true : post.author == filterAuthorId);
    }
    if (filteredPosts !== undefined && filterCategoryId !== undefined) {
      filteredPosts = filteredPosts.filter( post => filterCategoryId == -1 ? true : post.categories[0] == filterCategoryId);
    }

    let arrPosts = [];
    if (filteredPosts !== undefined) {
      filteredPosts.forEach((element) => {
        arrPosts.push(<li key={element.id}>{element.title.rendered}</li>);
      });
    }

    return (
      <React.Fragment>
        <ul>
          {arrPosts}
        </ul>
      </React.Fragment>
    );
  }
}

export default PostsList;
