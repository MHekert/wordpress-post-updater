import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import Post from './Post';
import Column from './Column';
import _ from 'lodash';

class PostsList extends React.Component {
	constructor(props) {
		super(props);
		this.filterOutIgnoredCategories = this.filterOutIgnoredCategories.bind(this);
		this.filterByAuthor = this.filterByAuthor.bind(this);
		this.filterByCategory = this.filterByCategory.bind(this);
		this.filterByTitle = this.filterByTitle.bind(this);
		this.sortPosts = this.sortPosts.bind(this);
		this.changeOrder = this.changeOrder.bind(this);

		this.state = {
			orderedBy: 1,
			orderAsc: false,
			filteredPosts: this.props.posts
		};
		this.columns = [
			{ name: 'Numer', postKey: 'title.rendered' },
			{ name: 'Data wstawienia', postKey: 'date' },
			{ name: 'Data ostatniej modyfikacji', postKey: 'modified' }
		];
	}

	filterOutIgnoredCategories(posts, ignoredCategoriesIds) {
		if (posts !== undefined && ignoredCategoriesIds.length !== 0) {
			return posts.filter((post) => post.categories.some((el) => !ignoredCategoriesIds.includes(el)));
		} else {
			return posts;
		}
	}

	filterByAuthor(posts, authorId) {
		if (posts !== undefined && authorId !== undefined) {
			return posts.filter((post) => (authorId == -1 ? true : post.author == authorId));
		} else {
			return posts;
		}
	}

	filterByCategory(posts, categoryId) {
		if (posts !== undefined && categoryId !== undefined) {
			return posts.filter((post) => (categoryId == -1 ? true : post.categories[0] == categoryId));
		} else {
			return posts;
		}
	}

	filterByTitle(posts, ignoredKeywords) {
		if (posts !== undefined && ignoredKeywords.length !== 0) {
			return posts.filter((post) => !ignoredKeywords.some((el) => post.title.rendered.indexOf(el) !== -1));
		} else {
			return posts;
		}
	}

	changeOrder(postKey, columnIndex) {
		const { orderedBy, orderAsc } = this.state;
		if (orderedBy !== columnIndex) {
			this.setState({
				orderedBy: columnIndex,
				orderAsc: false,
				filteredPosts: this.sortPosts(this.state.filteredPosts, columnIndex, false)
			});
		} else {
			this.setState({
				orderAsc: !orderAsc,
				filteredPosts: this.sortPosts(this.state.filteredPosts, columnIndex, !orderAsc)
			});
		}
	}

	sortPosts(posts, orderedBy, orderAsc) {
		const orderByKey = this.columns[orderedBy].postKey;
		if (!orderAsc) {
			return _.orderBy(posts, orderByKey, 'desc');
		} else {
			return _.orderBy(posts, orderByKey, 'asc');
		}
	}

	filterOutPosts() {
		const { orderedBy, orderAsc } = this.state;
		let filteredPosts = this.props.posts;
		const { filterAuthorId, filterCategoryId } = this.props;
		const ignoredCategoriesIds = sharedConfig.ignoredCategoriesIds;
		const ignoredKeywords = sharedConfig.ignoredPosts.titleKeywords;

		filteredPosts = this.filterByAuthor(filteredPosts, filterAuthorId);
		filteredPosts = this.filterByCategory(filteredPosts, filterCategoryId);
		filteredPosts = this.filterOutIgnoredCategories(filteredPosts, ignoredCategoriesIds);
		filteredPosts = this.filterByTitle(filteredPosts, ignoredKeywords);
		filteredPosts = this.sortPosts(filteredPosts, orderedBy, orderAsc);
		this.setState({
			filteredPosts: filteredPosts
		});
	}

	componentDidMount() {
		this.filterOutPosts();
	}

	componentWillReceiveProps(nextProps) {
		this.filterOutPosts();
	}

	render() {
		const columns = this.columns;
		const { filteredPosts } = this.state;

		let arrPosts = [];
		if (filteredPosts !== undefined) {
			filteredPosts.forEach((element) => {
				arrPosts.push(
					<Post
						setCurrentPost={this.props.setCurrentPost}
						key={element.id}
						post={element}
						setPostUpdateMode={this.props.setPostUpdateMode}
					/>
				);
			});
		}

		return (
			<React.Fragment>
				<table>
					<thead>
						<tr>
							{columns.map((el, index) => (
								<Column
									name={el.name}
									columnIndex={index}
									postKey={el.postKey}
									key={el.name}
									changeOrder={this.changeOrder}
								/>
							))}
						</tr>
					</thead>
					<tbody>{arrPosts}</tbody>
				</table>
			</React.Fragment>
		);
	}
}

export default PostsList;
