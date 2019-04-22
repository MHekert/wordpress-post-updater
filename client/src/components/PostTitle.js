import React, { Component } from 'react'

class PostTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({
            title: e.target.value
        });
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.title !== this.state.title) this.setState({title: nextProps.title});
    }

    render() {
        this.props.setTitle(this.state.title);
        
        return (
            <input value={this.state.title} onChange={this.onChange}></input>
        );
        // return (<h2>{this.props.title}</h2>);
    }
}
export default PostTitle;