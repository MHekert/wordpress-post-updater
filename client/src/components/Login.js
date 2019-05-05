import React, { Component } from 'react';
import sharedConfig from '../sharedConfig.json';
import axios from 'axios';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
	}

	componentDidMount() {
		this.login('', '');
	}

	async login(username, password) {
		let instance = axios.create({
			withCredentials: true
		});
		instance
			.post(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/login`, {
				username: username,
				password: password
			})
			.then((response) => {
				this.props.logged(response.data.id);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	handleUsernameChange(val) {
		this.setState({
			username: val
		});
	}

	handlePasswordChange(val) {
		this.setState({
			password: val
		});
	}

	render() {
		const { username, password } = this.state;
		return (
			<React.Fragment>
				<input type="text" value={username} onChange={(e) => this.handleUsernameChange(e.target.value)} />
				<input type="password" value={password} onChange={(e) => this.handlePasswordChange(e.target.value)} />
				<button onClick={() => this.login(username, password)}>not logged</button>
			</React.Fragment>
		);
	}
}

export default Login;
