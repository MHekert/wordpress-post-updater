import React, { Component } from 'react';
import parse5 from 'parse5';
import PostViewerElements from './PostViewerElements';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
		this.tags = [ 'p', 'td' ];
		this.elementHTML = [];
		this.tdLinks = [];
		this.tdLinksBackup = [];
		this.mainNode = {};
		this.iterator = [];
		this.getNodes = this.getNodes.bind(this);
		this.setElementHTML = this.setElementHTML.bind(this);
		this.submitPost = this.submitPost.bind(this);
		this.getPartiallyAlteredNode = this.getPartiallyAlteredNode.bind(this);
		this.getAlteredNode = this.getAlteredNode.bind(this);
		this.setIterator = this.setIterator.bind(this);
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

	getPartiallyAlteredNode(tag, elNode, which, mainNode, index) {
		const childNodes = mainNode.childNodes;
		let newMainNode = { ...mainNode };
		if (childNodes !== undefined) {
			let newChildNodes = childNodes.map((node) => {
				if (node.tagName === tag && !node.childNodes.some((el) => el.tagName === 'a')) {
					if (which === this.iterator[index]) {
						let newNode = { ...node };
						newNode.childNodes = elNode.childNodes;
						newNode.attrs = elNode.attrs;
						newNode.value = elNode.value;
						this.iterator.splice(index, 1, ++this.iterator[index]);
						return newNode;
					} else {
						this.iterator.splice(index, 1, ++this.iterator[index]);
						return node;
					}
				} else {
					return this.getPartiallyAlteredNode(tag, elNode, which, node, index);
				}
			});
			newMainNode.childNodes = newChildNodes;
			return newMainNode;
		} else {
			if (
				mainNode.tagName === tag &&
				which === this.iterator[index] &&
				!mainNode.childNodes.some((el) => el.tagName === 'a')
			) {
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

	setIterator(arr) {
		this.iterator = arr.map((el) => 0);
	}

	getAlteredNode() {
		const elementHTML = this.elementHTML;
		this.setIterator(elementHTML);
		let tagIterator = {};
		this.tags.forEach((el) => (tagIterator[el] = 0));
		elementHTML.forEach((el, index) => {
			let elNode = parse5.parseFragment(el);
			elNode = elNode.childNodes[0];
			this.mainNode = this.getPartiallyAlteredNode(
				elNode.tagName,
				elNode,
				tagIterator[elNode.tagName],
				this.mainNode,
				index
			);
			++tagIterator[elNode.tagName];
		});
		return this.mainNode;
	}

	setLinkPlaceholder(index) {}

	setElementHTML(index, tagName, value, isBold, isUnderlined) {
		const ifBold = { start: `${isBold ? `<strong>` : ``}`, end: `${isBold ? `</strong>` : ``}` };
		const ifUnderlined = { start: `${isUnderlined ? `<u>` : ``}`, end: `${isUnderlined ? `</u>` : ``}` };
		let output = `<${tagName}>${ifBold.start}${ifUnderlined.start}${value}${ifUnderlined.end}${ifBold.end}</${tagName}>`;
		this.elementHTML.splice(index, 1, output);
		this.iterator.splice(index, 1, 0);
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

		const tdlinks = this.getNodes('td', this.mainNode).filter((el) =>
			el.childNodes.some((el2) => el2.tagName === 'a')
		);
		this.tdLinks = tdlinks.slice();
		this.tdLinksBackup = tdlinks.slice();

		let postViewerElements = this.tags.map((tag) => this.getNodes(tag, this.mainNode));

		this.elementHTML = [];
		postViewerElements.forEach((el) => {
			el.forEach((el2) => {
				if (!el2.childNodes.some((el3) => el3.tagName === 'a')) {
					this.elementHTML.push(`<${el2.tagName}>${parse5.serialize(el2)}</${el2.tagName}>`);
				}
			});
		});

		postViewerElements = postViewerElements
			.reduce((previousValue, currentValue, index, array) => {
				return previousValue.concat(currentValue);
			})
			.filter((el) => !el.childNodes.some((el2) => el2.tagName === 'a'));
		this.setIterator(this.elementHTML);
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
