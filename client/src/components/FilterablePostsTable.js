import React, { Component } from 'react';

import PostList from './PostList';
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
		const { posts, authors, categories } = this.props;
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
				<PostList posts={posts} filterAuthorId={filterAuthorId} filterCategoryId={filterCategoryId} />
			</React.Fragment>
		);
	}
}

export default FilterablePostsTable;
