import React, {Component} from 'react';
import FilterSelect from './FilterSelect';

class FilterForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
        this.handleFilterCategoryChange = this.handleFilterCategoryChange.bind(this);
    }

    handleFilterAuthorChange(val) {
        this.props.handleFilterAuthorChange(val);
    }

    handleFilterCategoryChange(val) {
        this.props.handleFilterCategoryChange(val);
    }
    

    render() {
        const authors = this.props.authors;
        const categories = this.props.categories;

        return(
            <React.Fragment>
                <FilterSelect onSelectChange={this.handleFilterAuthorChange} arrayOfObjects={authors}></FilterSelect>
                <FilterSelect onSelectChange={this.handleFilterCategoryChange} arrayOfObjects={categories}></FilterSelect>
            </React.Fragment>
        );
    }
}

export default FilterForm;