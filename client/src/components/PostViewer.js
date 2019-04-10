import React, { Component } from 'react';
import parse5 from 'parse5';
import PostViewerElements from './PostViewerElements';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
		this.getNodes = this.getNodes.bind(this);
	}

	getNodes(tag, node) {
		const childNodes = node.childNodes;
		let arr = [];
		if (childNodes !== undefined) {
			if (node.nodeName === tag) {
				arr = arr.concat(node);
			}
			childNodes.forEach((element) => {
				arr = arr.concat(this.getNodes(tag, element));
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
		const tags = [ 'p', 'tr' ];
		const postId = this.props.post ? this.props.post.id : '';
		const postContent = this.props.post ? this.props.post.content.rendered : '';
		const postViewerElements = tags.map((tag) => this.getNodes(tag, parse5.parseFragment(postContent)));
		return (
			<React.Fragment>
				<h2>{postId}</h2>
				<PostViewerElements getNodes={this.getNodes} elements={postViewerElements} />
				<p>{JSON.stringify(postContent)}</p>
			</React.Fragment>
		);
	}
}

export default PostViewer;
