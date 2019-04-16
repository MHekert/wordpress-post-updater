import React, { Component } from 'react';
import TdFileInput from './TdFileInput';

class ElementP extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			isBold: this.props.bold,
			isUnderlined: this.props.underline,
			isDirty: false
		};
		this.tag = this.props.node.tagName;
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
		this.setElementHTML(this.props.elementId, this.tag, value, this.state.isBold, this.state.isUnderlined);
	}

	boldToggle(e) {
		const isBold = !this.state.isBold;
		this.setState({
			isBold: !this.state.isBold
		});
		this.setElementHTML(this.props.elementId, this.tag, this.state.value, isBold, this.state.isUnderlined);
	}

	underlineToggle(e) {
		const isUnderlined = !this.state.isUnderlined;
		this.setState({
			isUnderlined: isUnderlined
		});
		this.setElementHTML(this.props.elementId, this.tag, this.state.value, this.state.isBold, isUnderlined);
	}

	setElementHTML(index, tagName, value, isBold, isUnderlined) {
		this.props.setElementHTML(index, tagName, value, isBold, isUnderlined);
	}

	render() {
		const { elementId, indexByTag } = this.props;
		const name = this.tagName === 'p' ? 'Paragraph:' : 'Row:';
		let tdFileInput;
		if (this.tag === 'td') {
			tdFileInput = (
				<TdFileInput
					index={elementId}
					setLinkPlaceholder={this.props.setLinkPlaceholder}
					indexByTag={indexByTag}
					tag={this.tag}
				/>
			);
		} else {
			tdFileInput = <React.Fragment />;
		}
		return (
			<React.Fragment>
				<label htmlFor={`${this.tag}-${indexByTag}`}>{name}</label>
				<textarea
					type="text"
					id={`${this.tag}-${indexByTag}`}
					value={this.state.value}
					onChange={this.onInputChange}
				/>
				<label htmlFor={`${this.tag}-${indexByTag}-bold`}>Bold</label>
				<input
					type="checkbox"
					id={`${this.tag}-${indexByTag}-bold`}
					checked={this.state.isBold}
					onChange={this.boldToggle}
				/>
				<label htmlFor={`${this.tag}-${indexByTag}-underline`}>Underline</label>
				<input
					type="checkbox"
					id={`${this.tag}-${indexByTag}-underline`}
					checked={this.state.isUnderlined}
					onChange={this.underlineToggle}
				/>
				<br />
				{tdFileInput}
				<br />
			</React.Fragment>
		);
	}
}
export default ElementP;
