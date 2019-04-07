import React, { Component } from 'react';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
	}

	populateContentBytags(tag, content) {
		if (content.indexOf(tag.start) !== -1) {
			let contentAfterRemoving =
				content.slice(0, content.indexOf(tag.start)) +
				content.slice(content.indexOf(tag.end) + tag.end.length, content.length);
			let contentOfTag = content.slice(content.indexOf(tag.start) + tag.start.length, content.indexOf(tag.end));

			return this.populateContentBytags(tag, contentAfterRemoving) + '!@#$' + contentOfTag;
		} else {
			return '!@#$';
		}
	}

	decodePostContent(content) {
		let tags = [ { name: 'p', start: '<p>', end: '</p>' }, { name: 'table', start: '<table>', end: '</table>' } ];
		let obj = {};
		tags.forEach((tag) => {
			obj[tag.name] = this.populateContentBytags(tag, content).split('!@#$').filter((el) => el != '');
		});
		return obj;
	}

	render() {
		const postId = this.props.post ? this.props.post.id : '';
		const postContent = this.props.post ? this.props.post.content.rendered : '{}';
		const decodedContent = this.decodePostContent(postContent);
		return (
			<React.Fragment>
				<h2>{postId}</h2>
				<p>{JSON.stringify(decodedContent)}</p>
			</React.Fragment>
		);
	}
}

export default PostViewer;
