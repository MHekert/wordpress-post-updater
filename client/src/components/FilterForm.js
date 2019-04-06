import React, { Component } from 'react';
import FilterSelect from './FilterSelect';
import sharedConfig from '../sharedConfig.json';

class FilterForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
		this.handleFilterCategoryChange = this.handleFilterCategoryChange.bind(this);
		this.filterOutIgnoredObjs = this.filterOutIgnoredObjs.bind(this);
	}

	filterOutIgnoredObjs(objs, ignoredIdsArr) {
		if (objs !== undefined && ignoredIdsArr.length !== 0) {
			return objs.filter((el) => !ignoredIdsArr.includes(el.id));
		} else {
			return objs;
		}
	}

	handleFilterAuthorChange(val) {
		this.props.handleFilterAuthorChange(val);
	}

	handleFilterCategoryChange(val) {
		this.props.handleFilterCategoryChange(val);
	}

	render() {
		const categories = this.filterOutIgnoredObjs(this.props.categories, sharedConfig.ignoredCategoriesIds);
		const authors = this.filterOutIgnoredObjs(this.props.authors, sharedConfig.ignoredAuthorsIds);
		const selectName = [ 'Autorzy', 'Kategorie' ];

		return (
			<React.Fragment>
				<FilterSelect
					onSelectChange={this.handleFilterAuthorChange}
					arrayOfObjects={authors}
					selectName={selectName[0]}
				/>
				<FilterSelect
					onSelectChange={this.handleFilterCategoryChange}
					arrayOfObjects={categories}
					selectName={selectName[1]}
				/>
			</React.Fragment>
		);
	}
}

export default FilterForm;
