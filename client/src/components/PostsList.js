import React, { Component } from 'react';


class PostsList extends React.Component {

  render() {
    let filteredPosts = this.props.data.posts;
    const filterAuthor = this.props.data.filterAuthor;

    if (filteredPosts !== undefined && Object.entries(filterAuthor).length !== 0) {
      filteredPosts = filteredPosts.filter( post => post.author === filterAuthor.id)
    }


    let arrPosts = [];
    if (filteredPosts !== undefined) {
      filteredPosts.forEach((element) => {
        arrPosts.push(<li key={element.id}>{element.title.rendered}</li>);
      });
    }

      return (
        <>
          <ul>
            {arrPosts}
          </ul>
        </>
      );
    }
  }

  export default PostsList;
