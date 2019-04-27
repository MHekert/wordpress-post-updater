import React, { Component } from 'react';

class PostTitle extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		this.props.setTitle(e.target.value);
	}

	render() {
		return <input value={this.props.title} onChange={this.onChange} />;
	}
}
export default PostTitle;
