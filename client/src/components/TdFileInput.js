import React, { Component } from 'react';

class TdFileInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: this.props.fileName !== ''
		};
		this.onFileChange = this.onFileChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
	}

	onFileChange(tag, index, e) {
		let file = e.target.files[0];
		let reset = (() => (e.target.value === '' ? true : false))() && this.props.element.link === '';

		if (!reset) {
			this.setState({ isVisible: true });
		} else {
			this.setState({ isVisible: false });
		}

		this.props.setFile(tag, index, file);
		if (this.props.element.fileName === '') this.props.setFileName(tag, index, file.name);
	}

	onTextChange(tag, index, e) {
		this.props.setFileName(tag, index, e.target.value);
	}

	render() {
		const { index, tag } = this.props;
		const id = `${tag}-${index}-file`;
		const isVisible = this.state.isVisible;

		return (
			<React.Fragment>
				<input type="file" id={id} onChange={(e) => this.onFileChange(tag, index, e)} />
				<br />
				{isVisible ? (
					<input
						type="text"
						value={this.props.element.fileName}
						onChange={(e) => this.onTextChange(tag, index, e)}
					/>
				) : null}
			</React.Fragment>
		);
	}
}

export default TdFileInput;
