import React, { Component } from 'react';
import parse5 from 'parse5';
import PostViewerElements from './PostViewerElements';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
		this.elementHTML = [];
		this.getNodes = this.getNodes.bind(this);
		this.setElementHTML = this.setElementHTML.bind(this);
		this.submitPost = this.submitPost.bind(this);
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

	setElementHTML(index, tagName, value, isBold, isUnderlined) {
		const ifBold = { start: `${isBold ? `<strong>` : ``}`, end: `${isBold ? `</strong>` : ``}` };
		const ifUnderlined = { start: `${isUnderlined ? `<u>` : ``}`, end: `${isUnderlined ? `</u>` : ``}` };
		let output = `<${tagName}>${ifBold.start}${ifUnderlined.start}${value}${ifUnderlined.end}${ifBold.end}</${tagName}>`;
		this.elementHTML[index] = output;
	}

	clearElementHTML() {
		this.elementHTML = [];
	}

	submitPost(e) {
		e.preventDefault();
		console.log(this.elementHTML);
	}

	render() {
		const tags = [ 'p', 'tr' ];
		const postId = this.props.post ? this.props.post.id : '';
		const postContent = this.props.post ? this.props.post.content.rendered : '';
		const postViewerElements = tags.map((tag) => this.getNodes(tag, parse5.parseFragment(postContent)));
		this.clearElementHTML();
		return (
			<React.Fragment>
				<h2>{postId}</h2>
				<form>
					<PostViewerElements
						getNodes={this.getNodes}
						elements={postViewerElements}
						setElementHTML={this.setElementHTML}
					/>
					<button onClick={this.submitPost}>Submit</button>
				</form>
				<p>{JSON.stringify(postContent)}</p>
			</React.Fragment>
		);
	}
}

export default PostViewer;
