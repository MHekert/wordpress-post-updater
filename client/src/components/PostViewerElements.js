import React, { Component } from 'react';
import ElementP from './ElementP.js';
import ElementTR from './ElementTR';

class PostViewerElements extends React.Component {
	constructor(props) {
		super(props);
		this.getJsxArrByTag = this.getJsxArrByTag.bind(this);
	}

	getJsxArrByTag(elementArr) {
		return elementArr.map((el, index) => {
			if (el.tagName === 'p') {
				const decomposedNode = this.decomposeElement(el);
				if (decomposedNode.value !== '\xa0')
					return <ElementP key={index} node={el} decomposedNode={decomposedNode} />;
			}
			if (el.tagName === 'tr') {
				const decomposedNode = this.decomposeElement(el);
				return <ElementTR key={index} node={el} decomposedNode={decomposedNode} />;
			}
		});
	}

	decomposeElement(node) {
		let obj = {};
		obj['value'] = this.props.getNodes('#text', node).map((el) => el.value).join();
		obj['bold'] = this.props.getNodes('strong', node).length > 0 || this.props.getNodes('b', node).length > 0;
		obj['underline'] = this.props
			.getNodes('span', node)
			.some(
				(span) =>
					span.attrs !== undefined && span.attrs.some((attr) => attr.value === 'text-decoration: underline;')
			);
		return obj;
	}

	render() {
		const elements = this.props.elements;
		const elementsJsx = elements.map((el) => {
			return this.getJsxArrByTag(el);
		});

		return elementsJsx;
	}
}

export default PostViewerElements;
