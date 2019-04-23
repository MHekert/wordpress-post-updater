import React, { Component } from 'react';
import ElementP from './ElementP.js';

class PostViewerElements extends React.Component {
	constructor(props) {
		super(props);
		this.getJsxArrByTag = this.getJsxArrByTag.bind(this);
	}

	getJsxArrByTag(elementArr) {
		let tags = [ ...new Set(elementArr.map((item) => item.tagName)) ];
		let countByTag = {};
		tags.forEach((tag) => {
			countByTag[tag] = 0;
		});

		return elementArr.map((el, index) => {
			const decomposedNode = this.decomposeElement(el);
			const { value, bold, underline } = this.decomposeElement(el);
			if (decomposedNode.value !== '\xa0' && decomposedNode.value !== '') {
				return (
					<ElementP
						setElementHTML={this.props.setElementHTML}
						key={index}
						elementId={index}
						node={el}
						value={value}
						bold={bold}
						underline={underline}
						setLinkPlaceholder={this.props.setLinkPlaceholder}
						setFiles={this.props.setFiles}
						setFileNames={this.props.setFileNames}
						indexByTag={countByTag[el.tagName]++}
					/>
				);
			}
		});
	}

	decomposeElement(node) {
		let obj = {};
		obj['value'] = this.props
			.getNodes('#text', node)
			.filter((el) => el.parentNode.tagName !== 'a')
			.map((el) => el.value)
			.filter((el) => el !== '\n')
			.join('');
		obj['bold'] = this.props.getNodes('strong', node).length > 0 || this.props.getNodes('b', node).length > 0;
		obj['underline'] =
			this.props.getNodes('u', node).length > 0 ||
			this.props
				.getNodes('span', node)
				.some(
					(span) =>
						span.attrs !== undefined &&
						span.attrs.some((attr) => attr.value === 'text-decoration: underline;')
				);
		return obj;
	}

	render() {
		const elements = this.props.elements;
		const elementsJsx = this.getJsxArrByTag(elements);

		return elementsJsx;
	}
}

export default PostViewerElements;
