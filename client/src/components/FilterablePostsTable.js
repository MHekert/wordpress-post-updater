import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import PostList from './PostList';
import FilterForm from './FilterForm';
import Spinner from './Spinner.js';

class FilterablePostsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
			filterAuthorId: -1,
			filterCategoryId: -1,
			orderBy: 2
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
		const { authors, categories, posts } = this.props;
		const { filterAuthorId, filterCategoryId, orderBy } = this.state;
		return (
			<React.Fragment>
				<FilterForm
					handleFilterAuthorChange={this.handleFilterAuthorChange}
					handleFilterCategoryChange={this.handleFilterCategoryChange}
					filterOutIgnoredCategories={this.filterOutIgnoredCategories}
					authors={authors}
					categories={categories}
					actualAuthorId={filterAuthorId}
					actualCategoryId={filterCategoryId}
				/>
				{posts.length !== 0 ? (
					<PostList
						setCurrentPost={this.props.setCurrentPost}
						posts={posts}
						filterAuthorId={filterAuthorId}
						filterCategoryId={filterCategoryId}
						orderBy={orderBy}
					/>
				) : (
					<Spinner> </Spinner>
				)}
			</React.Fragment>
		);
	}
}

export default FilterablePostsTable;
