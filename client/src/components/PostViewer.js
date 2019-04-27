import React, { Component } from 'react';
import parse5 from 'parse5';
import axios from 'axios';
import PostTitle from './PostTitle';
import ElementP from './ElementP.js';
import sharedConfig from '../sharedConfig.json';

class PostViewer extends React.Component {
	constructor(props) {
		super(props);
		this.tags = [ 'p', 'tr' ];
		this.state = {
			title: '',
			elementsP: [],
			elementsTr: []
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
			const elementsP = this.getNodes('p', parse5.parseFragment(postContent)).map((el) => {
				return { ...el, ...this.decomposeElement(el) };
			});
			const elementsTr = this.getNodes('tr', parse5.parseFragment(postContent)).map((el) => {
				return { ...el, ...this.decomposeElement(el) };
			});

			this.setState({
				title: props.post.title.rendered,
				elementsP: elementsP,
				elementsTr: elementsTr
			});
		}
	}

	generateHTML(state) {
		const template =
			'<div id="cmsmasters_row_" class="cmsmasters_row cmsmasters_color_scheme_default cmsmasters_row_top_default cmsmasters_row_bot_default cmsmasters_row_boxed"><div class="cmsmasters_row_outer_parent"><div class="cmsmasters_row_outer"><div class="cmsmasters_row_inner"><div class="cmsmasters_row_margin"><div id="cmsmasters_column_" class="cmsmasters_column one_first"><div class="cmsmasters_column_inner"><div class="cmsmasters_text">PLACEHOLDER</div></div></div></div></div></div></div></div>';
		const paragraphs = state.elementsP
			.map((el) => {
				const tagName = el.tagName;
				const ifBold = { start: `${el.bold ? `<strong>` : ``}`, end: `${el.bold ? `</strong>` : ``}` };
				const ifUnderlined = { start: `${el.underline ? `<u>` : ``}`, end: `${el.underline ? `</u>` : ``}` };
				const value = el.value;
				return `<${tagName}>${ifBold.start}${ifUnderlined.start}${value}${ifUnderlined.end}${ifBold.end}</${tagName}>`;
			})
			.join('');
		const table = '<table><tbody>'.concat(
			state.elementsTr
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
		let elements;
		if (tag === 'p') {
			elements = this.state.elementsP.slice();
			elements.splice(index, 1);
			this.setState({
				elementsP: elements
			});
		} else if (tag == 'tr') {
			elements = this.state.elementsTr.slice();
			elements.splice(index, 1);
			this.setState({
				elementsTr: elements
			});
		}
	}

	setFileName(tag, index, val) {
		let elements;
		if (tag === 'p') {
			elements = this.state.elementsP.slice();
			elements[index].fileName = val;
			this.setState({
				elementsP: elements
			});
		} else if (tag == 'tr') {
			elements = this.state.elementsTr.slice();
			elements[index].fileName = val;
			this.setState({
				elementsTr: elements
			});
		}
	}

	setFile(tag, index, val) {
		let elements;
		if (tag === 'p') {
			elements = this.state.elementsP.slice();
			elements[index].file = val;
			this.setState({
				elementsP: elements
			});
		} else if (tag == 'tr') {
			elements = this.state.elementsTr.slice();
			elements[index].file = val;
			this.setState({
				elementsTr: elements
			});
		}
	}

	textChange(tag, index, val) {
		let elements;
		if (tag === 'p') {
			elements = this.state.elementsP.slice();
			elements[index].value = val;
			this.setState({
				elementsP: elements
			});
		} else if (tag == 'tr') {
			elements = this.state.elementsTr.slice();
			elements[index].value = val;
			this.setState({
				elementsTr: elements
			});
		}
	}

	boldToggle(tag, index, val) {
		let elements;
		if (tag === 'p') {
			elements = this.state.elementsP.slice();
			elements[index].bold = val;
			this.setState({
				elementsP: elements
			});
		} else if (tag == 'tr') {
			elements = this.state.elementsTr.slice();
			elements[index].bold = val;
			this.setState({
				elementsTr: elements
			});
		}
	}

	boldToggle(tag, index, val) {
		let elements;
		if (tag === 'p') {
			elements = this.state.elementsP.slice();
			elements[index].bold = val;
			this.setState({
				elementsP: elements
			});
		} else if (tag == 'tr') {
			elements = this.state.elementsTr.slice();
			elements[index].bold = val;
			this.setState({
				elementsTr: elements
			});
		}
	}

	underlineToggle(tag, index, val) {
		let elements;
		if (tag === 'p') {
			elements = this.state.elementsP.slice();
			elements[index].underline = val;
			this.setState({
				elementsP: elements
			});
		} else if (tag == 'tr') {
			elements = this.state.elementsTr.slice();
			elements[index].underline = val;
			this.setState({
				elementsTr: elements
			});
		}
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
		state.elementsTr.forEach((el) => {
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
		const elementsP = this.state.elementsP;
		const elementsTr = this.state.elementsTr;
		const elementsPJsx = elementsP.map((el, index) => (
			<ElementP
				element={el}
				key={index}
				elementId={index}
				allowFiles={false}
				name={'Paragraph'}
				deleteElement={this.deleteElement}
				textChange={this.textChange}
				boldToggle={this.boldToggle}
				underlineToggle={this.underlineToggle}
				setFileName={this.setFileName}
				setFile={this.setFile}
			/>
		));
		const elementsTrJsx = elementsTr.map((el, index) => (
			<ElementP
				element={el}
				key={index}
				elementId={index}
				allowFiles={true}
				name={'Row'}
				deleteElement={this.deleteElement}
				textChange={this.textChange}
				boldToggle={this.boldToggle}
				underlineToggle={this.underlineToggle}
				setFileName={this.setFileName}
				setFile={this.setFile}
			/>
		));

		return (
			<React.Fragment>
				{this.props.post !== '' ? <PostTitle title={title} setTitle={this.setTitle} /> : null}
				<form>
					{elementsPJsx}
					{elementsTrJsx}
					{this.props.post !== '' ? (
						<button onClick={(e) => this.submitPost(e, this.state)}>Submit</button>
					) : null}
				</form>
			</React.Fragment>
		);
	}
}

export default PostViewer;
