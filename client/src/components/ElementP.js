import React, { Component } from 'react';
import parse5 from 'parse5';

class ElementP extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			isBold: this.props.bold,
			isUnderlined: this.props.underline,
			isDirty: false
		};
		this.tag = 'p';
		this.onInputChange = this.onInputChange.bind(this);
		this.boldToggle = this.boldToggle.bind(this);
		this.underlineToggle = this.underlineToggle.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.state.value) {
			this.setState({ value: nextProps.value });
		}
		if (nextProps.bold !== this.state.isBold) {
			this.setState({ isBold: nextProps.bold });
		}
		if (nextProps.underline !== this.state.isUnderlined) {
			this.setState({ isUnderlined: nextProps.underline });
		}
	}

	onInputChange(e) {
		const value = e.currentTarget.value;
		this.setState({
			value: e.currentTarget.value
		});
		this.setElementHTML(this.props.index, this.tag, value, this.state.isBold, this.state.isUnderlined);
	}

	boldToggle(e) {
		const isBold = !this.state.isBold;
		this.setState({
			isBold: !this.state.isBold
		});
		this.setElementHTML(this.props.index, this.tag, this.state.value, isBold, this.state.isUnderlined);
	}

	underlineToggle(e) {
		const isUnderlined = !this.state.isUnderlined;
		this.setState({
			isUnderlined: isUnderlined
		});
		this.setElementHTML(this.props.index, this.tag, this.state.value, this.state.isBold, isUnderlined);
	}

	setElementHTML(index, tagName, value, isBold, isUnderlined) {
		this.props.setElementHTML(index, tagName, value, isBold, isUnderlined);
	}

	render() {
		const { elementId } = this.props;

		return (
			<React.Fragment>
				<label htmlFor={`p${elementId}`}>Paragraph</label>
				<textarea type="text" id={`p${elementId}`} value={this.state.value} onChange={this.onInputChange} />
				<label htmlFor={`bold${elementId}`}>Bold</label>
				<input type="checkbox" id={`bold${elementId}`} checked={this.state.isBold} onChange={this.boldToggle} />
				<label htmlFor={`underline${elementId}`}>Underline</label>
				<input
					type="checkbox"
					id={`underline${elementId}`}
					checked={this.state.isUnderlined}
					onChange={this.underlineToggle}
				/>
			</React.Fragment>
		);
	}
}
export default ElementP;
