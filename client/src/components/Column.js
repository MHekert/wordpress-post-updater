import React, { Component } from 'react';

class Column extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClick(e, orderByPostKey, columnIndex) {
		this.props.changeOrder(orderByPostKey, columnIndex);
	}

	render() {
		const { name, columnIndex, postKey } = this.props;
		return <th onClick={(e) => this.handleClick(e, postKey, columnIndex)}>{name}</th>;
	}
}
export default Column;
