import React, { Component } from 'react';
import parse5 from 'parse5';
import axios from 'axios';
import PostViewerElements from './PostViewerElements';
import PostTitle from './PostTitle';
import sharedConfig from '../sharedConfig.json';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
		this.tags = [ 'p', 'td' ];
		this.elementHTML = [];
		this.title = '';
		this.files = [];
		this.fileNames = [];
		this.tdLinks = [];
		this.mainNode = {};
		this.iterator = [];
		this.getNodes = this.getNodes.bind(this);
		this.setElementHTML = this.setElementHTML.bind(this);
		this.submitPost = this.submitPost.bind(this);
		this.getPartiallyAlteredNode = this.getPartiallyAlteredNode.bind(this);
		this.getAlteredNode = this.getAlteredNode.bind(this);
		this.setIterator = this.setIterator.bind(this);
		this.setLinkPlaceholder = this.setLinkPlaceholder.bind(this);
		this.setFiles = this.setFiles.bind(this);
		this.setTitle = this.setTitle.bind(this);
		this.setFileNames = this.setFileNames.bind(this);
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
		let node = this.getAlteredNode();
		return this.getNodeHtmlWithLinkPlaceholders('td', node);
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

	setLinkPlaceholder(tag, index, reset) {
		reset ? this.tdLinks.splice(index, 1, null) : this.tdLinks.splice(index, 1, `link${index}`);
	}

	setFiles(file, index, reset) {
		reset ? this.files.splice(index, 1, null) : this.files.splice(index, 1, file);
	}

	setFileNames(value, index, reset) {
		reset ? this.fileNames.splice(index, 1, null) : this.fileNames.splice(index, 1, value);
	}

	getNodeHtmlWithLinkPlaceholders(tag, node) {
		let actualNode = parse5.serialize(node);
		let linksArr = this.getNodes(tag, node)
			.filter((el) => el.childNodes.some((el2) => el2.tagName === 'a'))
			.map((v) => parse5.serialize(v));
		linksArr.forEach((el, index) => {
			if (this.tdLinks[index] !== null) actualNode = actualNode.replace(el, this.tdLinks[index]);
		});
		return actualNode;
	}

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
		
		let formData = new FormData();
		formData.append('title', this.title);
		formData.append('content', this.getHTML());
		this.files.filter(el1 => el1 !== null).forEach( (el,index) => formData.append('file', el, this.fileNames[index]));

		axios({
			method: 'post',
			url: `${sharedConfig.backendPath}:${sharedConfig.backendPort}/update/post`,
			data: formData,
			config: { headers: {'Content-Type': 'multipart/form-data' }}
		
		}).then(function (response) {
			console.log(response);
		  })
		  .catch(function (error) {
			console.log(error);
		  });
	
	}

	setTitle(val) {
		this.title = val;
	}

	render() {
		const title = this.props.post ? this.props.post.title.rendered : '';
		const postId = this.props.post ? this.props.post.id : '';
		const postContent = this.props.post ? this.props.post.content.rendered : '';
		this.mainNode = parse5.parseFragment(postContent);

		const tdlinks = this.getNodes('td', this.mainNode)
			.filter((el) => el.childNodes.some((el2) => el2.tagName === 'a'))
			.map((r) => null);
		this.tdLinks = tdlinks.slice();
		this.files = tdlinks.slice();
		this.fileNames = tdlinks.slice();
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
				<PostTitle title={title} setTitle={this.setTitle}></PostTitle>
				<form>
					<PostViewerElements
						getNodes={this.getNodes}
						elements={postViewerElements}
						setElementHTML={this.setElementHTML}
						setLinkPlaceholder={this.setLinkPlaceholder}
						setFiles={this.setFiles}
						setFileNames={this.setFileNames}
					/>
					<button onClick={this.submitPost}>Submit</button>
				</form>
				<p>{JSON.stringify(postContent)}</p>
			</React.Fragment>
		);
	}
}

export default PostViewer;