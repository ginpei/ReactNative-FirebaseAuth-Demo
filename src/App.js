import React, { Component } from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	Button,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import firebase from 'firebase';
import secret from '../secret.json';

if (firebase.apps.length < 1) {
	firebase.initializeApp({
		apiKey: secret.API_KEY,
		authDomain: `${secret.PROJECT_ID}.firebaseapp.com`,
		databaseURL: `https://${secret.PROJECT_ID}.firebaseio.com`,
		storageBucket: `${secret.PROJECT_ID}.appspot.com`,
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
	if (value === null) {
		valueText = '';
	}
	else if (typeof value === 'boolean') {
		valueText = value ? 'Yes' : 'No';
	}
	else if (value instanceof Array) {
		valueText = value.join(',');
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

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			providers: null,
			email: null,
			loading: false,
			signedIn: false,
			uid: null,
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
						label="User ID"
						value={this.state.uid}
						/>
					<StatusText
						label="Providers"
						value={this.state.providers}
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
						title="Retrieve user ?"
						disabled={this.state.loading}
						onPress={_ => this.load()}
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
			const providers = user.providerData.length > 0 ? user.providerData.map(v => v.providerId) : ['anonymous'];
			this.setState({
				providers: providers,
				email: user.email,
				signedIn: true,
				uid: user.uid,
			});
		}
		else {
			this.setState({
				providers: null,
				email: null,
				signedIn: false,
				uid: null,
			});
		}
	}

	signInAnonymous() {
		this.setState({ loading: true });

		auth.signInAnonymously()
			.then(_ => {
				this.save();
				this.updateSignedInStatus();
				this.setState({ loading: false });
			});
	}

	/**
	 * @see https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
	 */
	signInEmail() {
		this.setState({ loading: true });

		const email = 'anonymous@example.com';
		const password = 'keepsecretyourpassword';
		auth.createUserWithEmailAndPassword(email, password)
			// if exists, just sign in instead of signing up
			.catch(error => {
				if (error.code ===  'auth/email-already-in-use') {
					return auth.signInWithEmailAndPassword(email, password)
				}
			})
			.then(_ => {
				this.save();
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
				this.save();
				this.updateSignedInStatus();
				this.setState({ loading: false });
			});
	}

	save() {
		console.debug('save user', auth.currentUser);
		return AsyncStorage.setItem('user', JSON.stringify(auth.currentUser));
	}

	load() {
		return AsyncStorage.getItem('user')
			.then(json => {
				const user = JSON.parse(json);
				// then how to retrieve signing in?
				console.debug('load user', user);
				return user;
			});
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
