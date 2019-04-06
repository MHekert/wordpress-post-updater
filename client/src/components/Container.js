import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import FilterablePostsTable from './FilterablePostsTable';

class Container extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			authors: [],
			categories: [],
			isCompletePostsList: false
			// currentAuthor: {}, //for later use
			// currentPost: {}
		};
		this.retrievePosts = this.retrievePosts.bind(this);
		this.retrieveAuthors = this.retrieveAuthors.bind(this);
		this.retrieveCategories = this.retrieveCategories.bind(this);

		this.setPosts = this.setPosts.bind(this);
		this.setAuthors = this.setAuthors.bind(this);
		this.setCategories = this.setCategories.bind(this);
	}

	componentDidMount() {
		this.setPosts(this.state.posts, 0, this.retrievePosts);
		this.setAuthors(this.state.authors, this.retrieveAuthors);
		this.setCategories(this.state.categories, this.retrieveCategories);
	}

	async retrievePosts(postsPage) {
		let response = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/posts/${postsPage}`);
		let jsonData = await response.json();
		return jsonData;
	}

	async retrieveAuthors() {
		let resposne = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/authors`);
		let jsonData = await resposne.json();
		return jsonData;
	}

	async retrieveCategories() {
		let response = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/categories`);
		let jsonData = await response.json();
		return jsonData;
	}

	async setPosts(actualPosts, whichPage, retrievePosts) {
		try {
			whichPage++;
			let response = await retrievePosts(whichPage);
			if (response.code === undefined) {
				let tmpPosts = [];
				tmpPosts = tmpPosts.concat(actualPosts, response);
				this.setState({
					posts: tmpPosts
				});
				this.setPosts(tmpPosts, whichPage, retrievePosts);
			} else {
				this.setState({
					isCompletePostsList: true
				});
			}
		} catch (e) {
			console.error(e);
		}
	}

	async setAuthors(actualAuthors, retrieveAuthors) {
		try {
			this.setState({
				authors: await this.retrieveAuthors()
			});
		} catch (e) {
			console.error(e);
		}
	}

	async setCategories(actualAuthors, retrieveCategories) {
		try {
			this.setState({
				categories: await retrieveCategories()
			});
		} catch (e) {
			console.error(e);
		}
	}

	render() {
		const { posts, authors, categories } = this.state;
		return (
			<React.Fragment>
				<FilterablePostsTable posts={posts} authors={authors} categories={categories} />
			</React.Fragment>
		);
	}
}

export default Container;
