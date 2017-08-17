/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	Button,
	AppRegistry,
	StyleSheet,
	Text,
	View
} from 'react-native';

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
			signedIn: false,
		};
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
						value={false}
						/>
					<StatusText
						label="Email"
						value={null}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Sign in (anonymous)"
						disabled={this.state.signedIn}
						onPress={_ => console.debug('Sgin in (anonymous)')}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Sign in (email)"
						disabled={this.state.signedIn}
						onPress={_ => console.debug('Sgin in (email)')}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Sign out"
						disabled={!this.state.signedIn}
						onPress={_ => console.debug('Sgin out')}
						/>
				</View>
				<View style={styles.buttonLine}>
					<Button
						title="Save signing in status"
						onPress={_ => console.debug('save')}
						/>
				</View>
			</View>
		);
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
});

AppRegistry.registerComponent('ReactNativeFirebaseAuth', () => ReactNativeFirebaseAuth);
