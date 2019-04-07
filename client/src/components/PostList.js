import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import Post from './Post';

class PostsList extends React.Component {
	constructor(props) {
		super(props);
		this.filterOutIgnoredCategories = this.filterOutIgnoredCategories.bind(this);
		this.filterByAuthor = this.filterByAuthor.bind(this);
		this.filterByCategory = this.filterByCategory.bind(this);
		this.filterByTitle = this.filterByTitle.bind(this);
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

	render() {
		let filteredPosts = this.props.posts;
		const { filterAuthorId, filterCategoryId } = this.props;
		const ignoredCategoriesIds = sharedConfig.ignoredCategoriesIds;
		const ignoredKeywords = sharedConfig.ignoredPosts.titleKeywords;

		filteredPosts = this.filterByAuthor(filteredPosts, filterAuthorId);
		filteredPosts = this.filterByCategory(filteredPosts, filterCategoryId);
		filteredPosts = this.filterOutIgnoredCategories(filteredPosts, ignoredCategoriesIds);
		filteredPosts = this.filterByTitle(filteredPosts, ignoredKeywords);

		let arrPosts = [];
		if (filteredPosts !== undefined) {
			filteredPosts.forEach((element) => {
				arrPosts.push(<Post setCurrentPost={this.props.setCurrentPost} key={element.id} post={element} />);
			});
		}

		return (
			<React.Fragment>
				<table>
					<thead>
						<tr>
							<th>Numer</th>
							<th>Data wstawienia</th>
							<th>Data ostatniej modyfikacji</th>
						</tr>
					</thead>
					<tbody>{arrPosts}</tbody>
				</table>
			</React.Fragment>
		);
	}
}

export default PostsList;
