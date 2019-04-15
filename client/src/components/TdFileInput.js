import React, { Component } from 'react';

class TdFileInput extends React.Component {
	render() {
		const id = `td-link-${this.props.index}`;
		return <input type="file" id={id} />;
	}
}

export default TdFileInput;
