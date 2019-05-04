import React, { Component } from 'react';
import PostList from './PostList';
import FilterForm from './FilterForm';
import Spinner from './Spinner.js';

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
						setPostUpdateMode={this.props.setPostUpdateMode}
					/>
				) : (
					<Spinner> </Spinner>
				)}
			</React.Fragment>
		);
	}
}

export default FilterablePostsTable;
