import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import FilterablePostsTable from './FilterablePostsTable';
import PostViewer from './PostViewer';
import Spinner from './Spinner';

class Container extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			isCompletePostsList: false,
			authors: [],
			categories: [],
			currentPost: undefined
		};
		this.setCurrentPost = this.setCurrentPost.bind(this);
		this.setAuthors = this.setAuthors.bind(this);
		this.setCategories = this.setCategories.bind(this);
		this.retrieveAuthors = this.retrieveAuthors.bind(this);
		this.retrieveCategories = this.retrieveCategories.bind(this);
		this.filterOutIgnoredObjs = this.filterOutIgnoredObjs.bind(this);

		this.retrievePosts = this.retrievePosts.bind(this);
		this.setPosts = this.setPosts.bind(this);
		this.reloadPost = this.reloadPost.bind(this);
	}

	componentDidMount() {
		this.setAuthors(this.state.authors, this.retrieveAuthors);
		this.setCategories(this.state.categories, this.retrieveCategories);
		this.setPosts(this.state.posts, 1, this.retrievePosts);
	}

	async reloadPost(postId) {
		const response = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/post/${postId}`);
		const updatedPost = await response.json();
		const posts = this.state.posts;
		const newPosts = [ ...posts.filter((el) => el.id !== postId), updatedPost ];
		this.setState({
			posts: newPosts
		});
		this.setCurrentPost(updatedPost);
	}

	async retrievePosts(postsPage) {
		const response = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/posts/${postsPage}`);
		const jsonData = response.json();
		return jsonData;
	}

	async setPosts(actualPosts, whichPage, retrievePosts) {
		try {
			const response = await retrievePosts(whichPage);
			let tmpPosts = [];
			if (whichPage <= response.totalPages) {
				tmpPosts = tmpPosts.concat(actualPosts, response.posts);
				this.setState({
					posts: tmpPosts
				});
				if (whichPage < response.totalPages) {
					this.setPosts(tmpPosts, ++whichPage, retrievePosts);
				} else {
					this.setState({
						isCompletePostsList: true
					});
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	setCurrentPost(post) {
		this.setState({
			currentPost: post
		});
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

	async retrieveAuthors() {
		const resposne = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/authors`);
		let jsonData = await resposne.json();
		jsonData = this.filterOutIgnoredObjs(jsonData, sharedConfig.ignoredAuthorsIds);
		return jsonData;
	}

	async retrieveCategories() {
		const response = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/categories`);
		let jsonData = await response.json();
		jsonData = this.filterOutIgnoredObjs(jsonData, sharedConfig.ignoredCategoriesIds);
		return jsonData;
	}

	filterOutIgnoredObjs(objs, ignoredIdsArr) {
		if (objs !== undefined && ignoredIdsArr.length !== 0) {
			return objs.filter((el) => !ignoredIdsArr.includes(el.id));
		} else {
			return objs;
		}
	}

	render() {
		const { authors, categories, posts } = this.state;
		const currentPostObj = this.state.currentPost;

		return (
			<React.Fragment>
				{currentPostObj !== undefined ? (
					<PostViewer post={currentPostObj} categories={categories} reloadPost={this.reloadPost} />
				) : null}
				{authors.length !== 0 && categories.length !== 0 ? (
					<FilterablePostsTable
						setCurrentPost={this.setCurrentPost}
						authors={authors}
						categories={categories}
						posts={posts}
					/>
				) : (
					<Spinner />
				)}
			</React.Fragment>
		);
	}
}

export default Container;
