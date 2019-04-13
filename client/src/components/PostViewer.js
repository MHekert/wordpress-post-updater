import React, { Component } from 'react';
import parse5 from 'parse5';
import PostViewerElements from './PostViewerElements';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
		this.tags = [ 'p', 'tr' ];
		this.elementHTML = [];
		this.mainNode = {};

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

	getHTML() {
		return parse5.serialize(this.getAlteredNode());
	}

	getPartiallyAlteredNode(tag, elNode, which, mainNode, iterator) {
		const childNodes = mainNode.childNodes;
		let newMainNode = { ...mainNode };
		if (childNodes !== undefined) {
			let newChildNodes = childNodes.map((node) => {
				if (node.tagName === tag) {
					if (which === iterator) {
						let newNode = { ...node };
						newNode.childNodes = elNode.childNodes;
						newNode.attrs = elNode.attrs;
						newNode.value = elNode.value;
						iterator++;
						return newNode;
					}
					iterator++;
					return node;
				} else {
					return this.getPartiallyAlteredNode(tag, elNode, which, node, iterator);
				}
			});
			newMainNode.childNodes = newChildNodes;
			return newMainNode;
		} else {
			if (mainNode.tagName === tag && which === iterator) {
				let newNode = { ...mainNode };
				newNode.childNodes = elNode.childNodes;
				newNode.attrs = elNode.attrs;
				newNode.value = elNode.value;
				return newNode;
			} else {
				return mainNode;
			}
		}
	}

	getAlteredNode() {
		const elementHTML = this.elementHTML;
		let tagIterator = {};
		this.tags.forEach((el) => (tagIterator[el] = 0));
		let newMainNode = { ...this.mainNode };
		elementHTML.forEach((el) => {
			let elNode = parse5.parseFragment(el);
			elNode = elNode.childNodes[0];
			newMainNode = this.getPartiallyAlteredNode(
				elNode.tagName,
				elNode,
				tagIterator[elNode.tagName],
				newMainNode,
				0
			);
			tagIterator[elNode.tagName]++;
		});
		return newMainNode;
	}

	setElementHTML(index, tagName, value, isBold, isUnderlined) {
		const ifBold = { start: `${isBold ? `<strong>` : ``}`, end: `${isBold ? `</strong>` : ``}` };
		const ifUnderlined = { start: `${isUnderlined ? `<u>` : ``}`, end: `${isUnderlined ? `</u>` : ``}` };
		let output = `<${tagName}>${ifBold.start}${ifUnderlined.start}${value}${ifUnderlined.end}${ifBold.end}</${tagName}>`;
		this.elementHTML.splice(index, 1, output);
		console.log(this.elementHTML);
	}

	clearElementHTML() {
		this.elementHTML = [];
	}

	submitPost(e) {
		e.preventDefault();
		console.log(this.getHTML());
	}

	render() {
		const postId = this.props.post ? this.props.post.id : '';
		const postContent = this.props.post ? this.props.post.content.rendered : '';
		this.mainNode = parse5.parseFragment(postContent);

		const postViewerElements = this.tags.map((tag) => this.getNodes(tag, this.mainNode));
		this.elementHTML = [];
		postViewerElements.forEach((el) => {
			el.forEach((el2) => {
				this.elementHTML.push(`<${el2.tagName}>${parse5.serialize(el2)}</${el2.tagName}>`);
			});
		});

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
