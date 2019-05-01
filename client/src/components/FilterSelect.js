import React, { Component } from 'react';

class FilterSelect extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.props.onSelectChange(e.target.value);
	}

	render() {
		const arrayOfObjects = this.props.arrayOfObjects;
		const selectName = this.props.selectName;
		const selectedOption = this.props.categoryId !== undefined ? this.props.categoryId : -1;
		let jsxArr = [];
		jsxArr.push(
			<option key={-1} value={-1}>
				{selectName}
			</option>
		);
		if (arrayOfObjects !== undefined) {
			arrayOfObjects.forEach((obj) => {
				jsxArr.push(
					<option key={obj.id} value={obj.id}>
						{obj.name}
					</option>
				);
			});
		}
		return (
			<React.Fragment>
				<select value={selectedOption} onChange={this.handleChange}>
					{jsxArr}
				</select>
			</React.Fragment>
		);
	}
}

export default FilterSelect;
