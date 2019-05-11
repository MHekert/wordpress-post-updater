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
		this.logout = this.logout.bind(this);
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

	logout() {
		let instance = axios.create({
			withCredentials: true
		});
		instance
			.post(`${sharedConfig.backendPath}:${sharedConfig.backendPort}/logout`)
			.then((response) => {
				this.props.logged(undefined);
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

	getJSX(state, props) {
		const { username, password } = state;
		const { loggedUserId } = props;
		if (loggedUserId === undefined) {
			return (
				<React.Fragment>
					<input
						type="text"
						placeholder="username"
						value={username}
						onChange={(e) => this.handleUsernameChange(e.target.value)}
					/>
					<input
						type="password"
						placeholder="password"
						value={password}
						onChange={(e) => this.handlePasswordChange(e.target.value)}
					/>
					<button onClick={() => this.login(username, password)}>Login</button>
				</React.Fragment>
			);
		} else {
			return <button onClick={this.logout}>Logout</button>;
		}
	}

	render() {
		const { username, password } = this.state;
		const { loggedUserId } = this.props;
		return this.getJSX(this.state, this.props);
	}
}

export default Login;
