/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	ActivityIndicator,
	Button,
	AppRegistry,
	StyleSheet,
	Text,
	View
} from 'react-native';
import firebase from 'firebase';
import cred from './cred.json';

if (firebase.apps.length < 1) {
	firebase.initializeApp({
		apiKey: `${cred.API_KEY}`,
		authDomain: `${cred.PROJECT_ID}.firebaseapp.com`,
		databaseURL: `https://${cred.PROJECT_ID}.firebaseio.com`,
		storageBucket: `${cred.PROJECT_ID}.appspot.com`,
	});
}
const auth = firebase.auth();

function StatusText({ label, value }) {
	const styles = StyleSheet.create({
		row: {
			display: 'flex',
			flexDirection: 'row',
		},
		label: {
			flex: 1,
			padding: 8,
			textAlign: 'right',
		},
		value: {
			flex: 1,
			padding: 8,
		},
	});

	let valueText;
	if (typeof value === 'boolean') {
		valueText = value ? 'Yes' : 'No';
	}
	else {
		valueText = String(value);
	}

	return (
		<View style={styles.row}>
			<Text style={styles.label}>{label}</Text>
			<Text style={styles.value}>{valueText}</Text>
		</View>
	);
}

export default class ReactNativeFirebaseAuth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			anonymous: false,
			email: null,
			loading: false,
			signedIn: false,
		};
	}

	componentWillMount() {
		this.updateSignedInStatus();
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.statusSection}>
					<StatusText
						label="Signed in?"
						value={this.state.signedIn}
						/>
					<StatusText
						label="Anonymous?"
						value={this.state.anonymous}
						/>
					<StatusText
						label="Email"
						value={this.state.email}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Sign in (anonymous)"
						disabled={this.state.loading || this.state.signedIn}
						onPress={_ => this.signInAnonymous()}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Sign in (email)"
						disabled={this.state.loading || this.state.signedIn}
						onPress={_ => this.signInEmail()}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Sign out"
						disabled={this.state.loading || !this.state.signedIn}
						onPress={_ => this.signOut()}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Save signing in status"
						disabled={this.state.loading || true}
						onPress={_ => this.save()}
						/>
				</View>
				<View style={[styles.loadingIndicator, { display: this.state.loading ? 'flex' : 'none' }]}>
					<ActivityIndicator style={styles.indicator} />
				</View>
			</View>
		);
	}

	updateSignedInStatus() {
		const user = auth && auth.currentUser;
		if (user) {
			this.setState({
				anonymous: user.providerData.length < 1,
				email: user ? user.email : null,
				signedIn: Boolean(user),
			});
		}
		else {
			this.setState({
				anonymous: false,
				email: null,
				signedIn: false,
			});
		}
	}

	signInAnonymous() {
		this.setState({ loading: true });

		auth.signInAnonymously()
			.then(_ => {
				this.updateSignedInStatus();
				this.setState({ loading: false });
			});
	}

	signInEmail() {
		this.setState({ loading: true });

		const email = 'anonymous@example.com';
		const password = 'keepsecretyourpassword';
		auth.createUserWithEmailAndPassword(email, password)
			.then(_ => {
				this.updateSignedInStatus();
				this.setState({ loading: false });
			});
	}

	signOut() {
		this.setState({ loading: true });

		const user = auth.currentUser;
		auth.signOut()
			.then(_ => {
				// delete user
				if (user) {
					return user.delete();
				}
				else {
					return Promise.resolve();
				}
			})
			.then(_ => {
				this.updateSignedInStatus();
				this.setState({ loading: false });
			});
	}

	save() {
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: '#fff',
		flex: 1,
		justifyContent: 'center',
	},
	statusSection: {
		marginBottom: 32,
		width: '100%',
	},
	buttonLine: {
		marginBottom: 16,
		minWidth: '50%',
		paddingLeft: 16,
		paddingRight: 16,
	},
	loadingIndicator: {
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		position: 'absolute',
		width: '100%',
	},
});

AppRegistry.registerComponent('ReactNativeFirebaseAuth', () => ReactNativeFirebaseAuth);
