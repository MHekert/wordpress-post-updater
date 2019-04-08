import React, { Component } from 'react';
import parse5 from 'parse5';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
	}

	// populateContentBytags(tag, content) {
	// 	if (content.indexOf(tag.start) !== -1) {
	// 		let contentAfterRemoving =
	// 			content.slice(0, content.indexOf(tag.start)) +
	// 			content.slice(content.indexOf(tag.end) + tag.end.length, content.length);
	// 		let contentOfTag = content.slice(content.indexOf(tag.start) + tag.start.length, content.indexOf(tag.end));

	// 		return this.populateContentBytags(tag, contentAfterRemoving) + '!@#$' + contentOfTag;
	// 	} else {
	// 		return '!@#$';
	// 	}
	// }

	// decodePostContent(content, tags, ignoredArr) {
	// 	let obj = {};
	// 	tags.forEach((tag) => {
	// 		let contentByTagArr = this.populateContentBytags(tag, content).split('!@#$').filter((el) => el != '');
	// 		contentByTagArr = contentByTagArr.filter((el) => !ignoredArr.some((ignoredVal) => ignoredVal === el));
	// 		obj[tag.name] = contentByTagArr;
	// 	});
	// 	return obj;
	// }

	getNodes(tag, node) {
		const childNodes = node.childNodes;
		let arr = [];
		if (childNodes !== undefined) {
			childNodes.forEach((element) => {
				if (element.nodeName === tag) {
					arr = arr.concat(element, this.getNodes(tag, element));
				} else {
					arr = arr.concat(this.getNodes(tag, element));
				}
			});
			return arr;
		} else {
			if (node.nodeName === tag) {
				return node;
			} else {
				return [];
			}
		}
	}

	render() {
		const postId = this.props.post ? this.props.post.id : '';
		const postContent = this.props.post ? this.props.post.content.rendered : '';
		// const tags = [ { name: 'p', start: '<p>', end: '</p>' }, { name: 'table', start: '<table>', end: '</table>' } ];
		// const decodedContent = this.decodePostContent(postContent, tags, [ '', '&nbsp;' ]);

		let arr2 = this.getNodes('p', parse5.parseFragment(postContent));
		console.log(arr2);
		return (
			<React.Fragment>
				<h2>{postId}</h2>
				<p>{JSON.stringify(postContent)}</p>
			</React.Fragment>
		);
	}
}

export default PostViewer;
