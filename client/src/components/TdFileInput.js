import React, { Component } from 'react';

class TdFileInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false
		};
		this.onFileChange = this.onFileChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
	}

	onFileChange(tag, index, e) {
		let file = e.target.files[0];
		let reset = (() => (e.target.value === '' ? true : false))();
		this.props.setFiles(file, index, reset);
		this.props.setLinkPlaceholder(tag, index, reset);

		if(!reset) {
			this.props.setFileNames(null, index, true);
			this.setState({isVisible: true});
		} else {
			this.setState({isVisible: false});
		}
	}

	onTextChange(tag, index, e) {
		let value = e.target.value;
		let reset = (() => (e.target.value === '' ? true : false))();
		this.props.setFileNames(value, index, reset);
	}

	render() {
		const { indexByTag, tag } = this.props;
		const id = `${tag}-${indexByTag}-file`;
		const isVisible={display: this.state.isVisible ? 'block' : 'none' }

		return (
			<React.Fragment>
				<input type="file" id={id} onChange={(e) => this.onFileChange(tag, indexByTag, e)} />
				<br/>
				<input type="text" style={isVisible} onChange={(e => this.onTextChange(tag, indexByTag, e))}></input>
			</React.Fragment>
		);
	}
}

export default TdFileInput;
