import React, { Component } from 'react';
import parse5 from 'parse5';
import axios from 'axios';
import PostTitle from './PostTitle';
import Element from './Element.js';
import sharedConfig from '../sharedConfig.json';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
		this.tags = [ 'p', 'tr' ];
		this.state = {
			title: '',
			elements: {}
		};
		this.getNodes = this.getNodes.bind(this);
		this.deleteElement = this.deleteElement.bind(this);
		this.textChange = this.textChange.bind(this);
		this.boldToggle = this.boldToggle.bind(this);
		this.underlineToggle = this.underlineToggle.bind(this);
		this.setTitle = this.setTitle.bind(this);
		this.setFile = this.setFile.bind(this);
		this.setFileName = this.setFileName.bind(this);
	}

	componentDidMount() {
		this.setInitial(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setInitial(nextProps);
	}

	setInitial(props) {
		if (props.post.content !== undefined) {
			const postContent = props.post.content.rendered;
			let elements = {};
			this.tags.forEach((tag) => {
				elements[tag] = this.getNodes(tag, parse5.parseFragment(postContent)).map((el) => {
					return { ...el, ...this.decomposeElement(el) };
				});
			});
			this.setState({
				title: props.post.title.rendered,
				elements: elements
			});
		}
	}

	generateHTML(state) {
		const template =
			'<div id="cmsmasters_row_" class="cmsmasters_row cmsmasters_color_scheme_default cmsmasters_row_top_default cmsmasters_row_bot_default cmsmasters_row_boxed"><div class="cmsmasters_row_outer_parent"><div class="cmsmasters_row_outer"><div class="cmsmasters_row_inner"><div class="cmsmasters_row_margin"><div id="cmsmasters_column_" class="cmsmasters_column one_first"><div class="cmsmasters_column_inner"><div class="cmsmasters_text">PLACEHOLDER</div></div></div></div></div></div></div></div>';
		const paragraphs = state.elements['p']
			.map((el) => {
				const tagName = el.tagName;
				const ifBold = { start: `${el.bold ? `<strong>` : ``}`, end: `${el.bold ? `</strong>` : ``}` };
				const ifUnderlined = { start: `${el.underline ? `<u>` : ``}`, end: `${el.underline ? `</u>` : ``}` };
				const value = el.value;
				return `<${tagName}>${ifBold.start}${ifUnderlined.start}${value}${ifUnderlined.end}${ifBold.end}</${tagName}>`;
			})
			.join('');
		const table = '<table><tbody>'.concat(
			state.elements['tr']
				.map((el) => {
					const ifBold = { start: `${el.bold ? `<strong>` : ``}`, end: `${el.bold ? `</strong>` : ``}` };
					const ifUnderlined = {
						start: `${el.underline ? `<u>` : ``}`,
						end: `${el.underline ? `</u>` : ``}`
					};
					const value = el.value;
					const link = el.link !== '' ? el.link : 'LINK_PLACEHOLDER';
					return `<tr><td width=\"50%\">${ifBold.start}${ifUnderlined.start}${value}${ifUnderlined.end}${ifBold.end}</td><td width=\"50%\">a href=\"${link}">${el.fileName}</a></td></tr>`;
				})
				.join(''),
			'</tbody></table>'
		);
		return template.replace('PLACEHOLDER', paragraphs.concat(table));
	}

	deleteElement(tag, index) {
		let elements = this.state.elements;
		let tmp = elements[tag].slice();
		tmp.splice(index, 1);
		elements[tag] = tmp.slice();
		this.setState({
			elements: elements
		});
	}

	setFileName(tag, index, val) {
		let elements = this.state.elements;
		elements[tag][index].fileName = val;
		this.setState({
			elements: elements
		});
	}

	setFile(tag, index, val) {
		let elements = this.state.elements;
		elements[tag][index].file = val;
		this.setState({
			elements: elements
		});
	}

	textChange(tag, index, val) {
		let elements = this.state.elements;
		elements[tag][index].value = val;
		this.setState({
			elements: elements
		});
	}

	boldToggle(tag, index, val) {
		let elements = this.state.elements;
		elements[tag][index].bold = val;
		this.setState({
			elements: elements
		});
	}

	underlineToggle(tag, index, val) {
		let elements = this.state.elements;
		elements[tag][index].underline = val;
		this.setState({
			elements: elements
		});
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

	submitPost(e, state) {
		e.preventDefault();
		console.log(this.generateHTML(state));
		let formData = new FormData();
		formData.append('title', state.title);
		formData.append('content', this.generateHTML(state));
		state.elements['tr'].forEach((el) => {
			formData.append('file', el.file, el.fileName);
		});

		axios({
			method: 'post',
			url: `${sharedConfig.backendPath}:${sharedConfig.backendPort}/update/post`,
			data: formData,
			config: { headers: { 'Content-Type': 'multipart/form-data' } }
		})
			.then(function(response) {
				console.log(response);
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	setTitle(title) {
		this.setState({
			title: title
		});
	}

	decomposeElement(node) {
		let obj = {};
		obj['value'] = this.getNodes('#text', node)
			.filter((el) => el.parentNode.tagName !== 'a')
			.map((el) => el.value)
			.filter((el) => el !== '\n')
			.join('');
		obj['bold'] = this.getNodes('strong', node).length > 0 || this.getNodes('b', node).length > 0;
		obj['underline'] =
			this.getNodes('u', node).length > 0 ||
			this.getNodes('span', node).some(
				(span) =>
					span.attrs !== undefined && span.attrs.some((attr) => attr.value === 'text-decoration: underline;')
			);
		let tmp = this.getNodes('a', node).map((el) => this.getNodes('#text', el)).flat().pop();
		obj['fileName'] = tmp !== undefined ? tmp.value : '';
		obj['link'] = this.getNodes('a', node)
			.map((el) => el.attrs)
			.filter((el) => (el.name = 'href'))
			.flat()
			.map((el) => el.value)
			.pop();
		obj['isDirty'] = false;
		obj['file'] = null;
		return obj;
	}

	render() {
		const title = this.state.title;
		const elements = this.state.elements;
		let elementsJsx = {};
		this.tags.forEach((tag) => {
			if (elements[tag] !== undefined) {
				elementsJsx[tag] = elements[tag].map((el, index) => {
					const name = tag === 'p' ? 'Paragraph' : tag === 'tr' ? 'Row' : null;
					const allowFiles = tag === 'tr' ? true : false;
					return (
						<Element
							element={el}
							key={`${tag}${index}`}
							elementId={index}
							allowFiles={allowFiles}
							name={name}
							deleteElement={this.deleteElement}
							textChange={this.textChange}
							boldToggle={this.boldToggle}
							underlineToggle={this.underlineToggle}
							setFileName={this.setFileName}
							setFile={this.setFile}
						/>
					);
				});
			}
		});

		return (
			<React.Fragment>
				{this.props.post !== '' ? <PostTitle title={title} setTitle={this.setTitle} /> : null}
				<form>
					{elementsJsx['p']}
					<button>add</button>
					{elementsJsx['tr']}
					{this.props.post !== '' ? (
						<button onClick={(e) => this.submitPost(e, this.state)}>Submit</button>
					) : null}
				</form>
			</React.Fragment>
		);
	}
}

export default PostViewer;
