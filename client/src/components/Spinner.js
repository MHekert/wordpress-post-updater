import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';

class Spinner extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="sweet-loading">
				<ClipLoader sizeUnit={'px'} size={150} color={'#123abc'} />
			</div>
		);
	}
}

export default Spinner;
