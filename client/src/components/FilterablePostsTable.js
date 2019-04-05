import React, { Component } from 'react';

import PostsList from './PostsList';
import FilterForm from './FilterForm';

class FilterablePostsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
			filterAuthorId: -1,
			filterCategoryId: -1
		};
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
		const posts = this.props.posts;
		const authors = this.props.authors;
		const categories = this.props.categories;
		const filterAuthorId = this.state.filterAuthorId;
		const filterCategoryId = this.state.filterCategoryId;
		console.log(filterAuthorId);
		return (
			<React.Fragment>
				<FilterForm
					handleFilterAuthorChange={this.handleFilterAuthorChange}
					handleFilterCategoryChange={this.handleFilterCategoryChange}
					filterOutIgnoredCategories={this.filterOutIgnoredCategories}
					authors={authors}
					categories={categories}
				/>
				<PostsList posts={posts} filterAuthorId={filterAuthorId} filterCategoryId={filterCategoryId} />
			</React.Fragment>
		);
	}
}

export default FilterablePostsTable;
