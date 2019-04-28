import React, { Component } from 'react';
import TdFileInput from './TdFileInput';

class Element extends React.Component {
	constructor(props) {
		super(props);
		this.tag = this.props.element.tagName;
	}

	deleteElement(tag, index, e) {
		e.preventDefault();
		this.props.deleteElement(tag, index);
	}

	onInputChange(tag, index, e) {
		this.props.textChange(tag, index, e.currentTarget.value);
	}

	boldToggle(tag, index, e) {
		this.props.boldToggle(tag, index, !this.props.element.bold);
	}

	underlineToggle(tag, index, e) {
		this.props.underlineToggle(tag, index, !this.props.element.underline);
	}

	render() {
		const { elementId } = this.props;
		const name = this.props.name;
		const allowFiles = this.props.allowFiles;
		let tdFileInput;
		if (allowFiles) {
			tdFileInput = (
				<TdFileInput
					index={this.props.elementId}
					element={this.props.element}
					setFileName={this.props.setFileName}
					setFile={this.props.setFile}
					tag={this.tag}
				/>
			);
		} else {
			tdFileInput = null;
		}
		return (
			<React.Fragment>
				<label htmlFor={`${this.tag}-${elementId}`}>{name}</label>
				<textarea
					type="text"
					id={`${this.tag}-${elementId}`}
					value={this.props.element.value}
					onChange={(e) => this.onInputChange(this.tag, elementId, e)}
				/>
				<label htmlFor={`${this.tag}-${elementId}-bold`}>Bold</label>
				<input
					type="checkbox"
					id={`${this.tag}-${elementId}-bold`}
					checked={this.props.element.bold}
					onChange={(e) => this.boldToggle(this.tag, elementId, e)}
				/>
				<label htmlFor={`${this.tag}-${elementId}-underline`}>Underline</label>
				<input
					type="checkbox"
					id={`${this.tag}-${elementId}-underline`}
					checked={this.props.element.underline}
					onChange={(e) => this.underlineToggle(this.tag, elementId, e)}
				/>
				<button onClick={(e) => this.deleteElement(this.tag, elementId, e)}>del</button>
				<br />
				{tdFileInput}
				<br />
			</React.Fragment>
		);
	}
}
export default Element;
