import React, { Component } from 'react';

class Column extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClick(columnIndex) {
		this.props.changeOrder(columnIndex);
	}

	render() {
		const { name, columnIndex, postKey } = this.props;
		return <th onClick={(e) => this.handleClick(columnIndex)}>{name}</th>;
	}
}
export default Column;
