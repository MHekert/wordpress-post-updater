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

	retrievePosts(postsPage) {
		let postsPromise = new Promise((resolve, reject) => {
			fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/posts/${postsPage}`)
				.then((response) => response.json())
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
		let authorsPromise = new Promise((resolve, reject) => {
			fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/authors`)
				.then((response) => response.json())
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
		let categoriesPromise = new Promise((resolve, reject) => {
			fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/categories`)
				.then((response) => response.json())
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

	setPosts(actualPosts, whichPage, retrievePosts) {
		whichPage++;
		retrievePosts(whichPage).then(
			(response) => {
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
			},
			(error) => {
				console.error(error);
			}
		);
	}

	setAuthors(actualAuthors, retrieveAuthors) {
		retrieveAuthors().then(
			(newAuthors) => {
				this.setState({
					authors: newAuthors
				});
			},
			(error) => {
				console.error(error);
			}
		);
	}

	setCategories(actualAuthors, retrieveCategories) {
		retrieveCategories().then(
			(newCategories) => {
				this.setState({
					categories: newCategories
				});
			},
			(error) => {
				console.error(error);
			}
		);
	}

	render() {
		const posts = this.state.posts;
		const authors = this.state.authors;
		const categories = this.state.categories;
		return (
			<React.Fragment>
				<FilterablePostsTable posts={posts} authors={authors} categories={categories} />
			</React.Fragment>
		);
	}
}

export default Container;
