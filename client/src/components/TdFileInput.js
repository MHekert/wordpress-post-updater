import React, { Component } from 'react';

class TdFileInput extends React.Component {
	constructor(props) {
		super(props);
		this.onFileChange = this.onFileChange.bind(this);
	}

	onFileChange(tag, index, val) {
		let reset = (() => (val === '' ? true : false))();
		this.props.setLinkPlaceholder(tag, index, reset);
	}

	render() {
		const { indexByTag, tag } = this.props;

		const id = `${tag}-${indexByTag}-file`;
		return <input type="file" id={id} onChange={(e) => this.onFileChange(tag, indexByTag, e.target.value)} />;
	}
}

export default TdFileInput;
