import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import FilterablePostsTable from './FilterablePostsTable';
import PostViewer from './PostViewer';
import Spinner from './Spinner';

class Container extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
	}

	componentDidMount() {
		this.setAuthors(this.state.authors, this.retrieveAuthors);
		this.setCategories(this.state.categories, this.retrieveCategories);
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
		let resposne = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/authors`);
		let jsonData = await resposne.json();
		jsonData = this.filterOutIgnoredObjs(jsonData, sharedConfig.ignoredAuthorsIds);
		return jsonData;
	}

	async retrieveCategories() {
		let response = await fetch(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/categories`);
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
		const { authors, categories } = this.state;
		const currentPostObj = this.state.currentPost;

		return (
			<React.Fragment>
				{currentPostObj !== undefined ? <PostViewer post={currentPostObj} categories={categories} /> : null}
				{authors.length !== 0 && categories.length !== 0 ? (
					<FilterablePostsTable
						setCurrentPost={this.setCurrentPost}
						authors={authors}
						categories={categories}
					/>
				) : (
					<Spinner />
				)}
			</React.Fragment>
		);
	}
}

export default Container;
