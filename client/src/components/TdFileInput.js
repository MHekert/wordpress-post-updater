import React, { Component } from 'react';

class TdFileInput extends React.Component {
	constructor(props) {
		super(props);
		this.onFileChange = this.onFileChange.bind(this);
	}

	onFileChange(tag, index, e) {
		let file = e.target.files[0];
		let reset = (() => (e.target.value === '' ? true : false))();
		this.props.setFiles(file, index, reset);
		this.props.setLinkPlaceholder(tag, index, reset);
	}

	render() {
		const { indexByTag, tag } = this.props;

		const id = `${tag}-${indexByTag}-file`;
		return <input type="file" id={id} onChange={(e) => this.onFileChange(tag, indexByTag, e)} />;
	}
}

export default TdFileInput;
