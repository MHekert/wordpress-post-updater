import React, { Component } from 'react';
import Moment from 'react-moment';
import sharedConfig from '../sharedConfig.json';

class Post extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isHighlighted: false
		};
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseOut = this.onMouseOut.bind(this);
	}

	onMouseOver(e) {
		this.setState({
			isHighlighted: true
		});
	}

	onMouseOut(e) {
		this.setState({
			isHighlighted: false
		});
	}

	handleClick(e) {
		this.props.setCurrentPost(this.props.post);
	}

	render() {
		const post = this.props.post;
		let hover;
		if (this.state.isHighlighted) {
			hover = {
				backgroundColor: 'aqua'
			};
		} else {
			hover = {
				backgroundColor: ''
			};
		}
		return (
			<React.Fragment>
				<tr
					id={post.id}
					key={post.id}
					style={hover}
					onMouseOver={(e) => this.onMouseOver(e)}
					onMouseOut={(e) => this.onMouseOut(e)}
					onClick={(e) => this.handleClick(e)}
				>
					<td>{post.title.rendered}</td>
					<td>
						<Moment format="DD-MM-YYYY">{post.date}</Moment>
					</td>
					<td>
						<Moment format="DD-MM-YYYY HH:MM">{post.modified_gmt}</Moment>
					</td>
				</tr>
			</React.Fragment>
		);
	}
}

export default Post;
