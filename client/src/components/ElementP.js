import React, { Component } from 'react';

class ElementP extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.decomposedNode.value,
			bold: false,
			underline: false,
			isDirty: false
		};
		this.onInputChange = this.onInputChange.bind(this);
	}

	onInputChange(e) {
		this.setState({
			value: e.currentTarget.value
		});
	}

	render() {
		const node = this.props.node;
		const { value, bold, underline } = this.props.decomposedNode;
		return <textarea type="text" value={this.state.value} onChange={this.onInputChange} />;
	}
}
export default ElementP;
