import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import PostList from './PostList';
import FilterForm from './FilterForm';

class FilterablePostsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			isCompletePostsList: false,
			filterText: '',
			filterAuthorId: -1,
			filterCategoryId: -1
		};
		this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
		this.handleFilterCategoryChange = this.handleFilterCategoryChange.bind(this);

		this.retrievePosts = this.retrievePosts.bind(this);

		this.setPosts = this.setPosts.bind(this);
	}

	componentDidMount() {
		this.setPosts(this.state.posts, 1, this.retrievePosts);
	}

	async retrievePosts(postsPage) {
		let response = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/posts/${postsPage}`);
		let jsonData = await response.json();
		return jsonData;
	}

	async setPosts(actualPosts, whichPage, retrievePosts) {
		try {
			let response = await retrievePosts(whichPage);
			if (whichPage < response.totalPages) {
				let tmpPosts = [];
				tmpPosts = tmpPosts.concat(actualPosts, response.posts);
				this.setState({
					posts: tmpPosts
				});
				this.setPosts(tmpPosts, ++whichPage, retrievePosts);
			} else {
				this.setState({
					isCompletePostsList: true
				});
			}
		} catch (e) {
			console.error(e);
		}
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
		const posts = this.state.posts;
		const { authors, categories } = this.props;
		const { filterAuthorId, filterCategoryId } = this.state;
		return (
			<React.Fragment>
				<FilterForm
					handleFilterAuthorChange={this.handleFilterAuthorChange}
					handleFilterCategoryChange={this.handleFilterCategoryChange}
					filterOutIgnoredCategories={this.filterOutIgnoredCategories}
					authors={authors}
					categories={categories}
				/>
				<PostList
					setCurrentPost={this.props.setCurrentPost}
					posts={posts}
					filterAuthorId={filterAuthorId}
					filterCategoryId={filterCategoryId}
				/>
			</React.Fragment>
		);
	}
}

export default FilterablePostsTable;
