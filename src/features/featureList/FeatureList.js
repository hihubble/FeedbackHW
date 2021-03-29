import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router";
import {
	addFeature,
	addFeatures,
	selectFeatures,
	setUserId,
	updateFeature,
} from '../../slices/featureSlice';
import firebase from "firebase/app";
import { database } from '../../firebase/firebase';
import 'firebase/database';
import 'firebase/auth';
import FeatureDetail from '../FeatureDetail/FeatureDetail';

/**
 * Displaying a feature list by listening to the database changes and updating itself when new features / or when a feature changes
 * @returns the HTML code of the fragment
 */
function FeatureList() {

	const dispatch = useDispatch();
	let features = [...useSelector(selectFeatures)];

	/**
	 * Sorts the feature list by reversed chronological order and put the highest voted one first
	 */
	const sort = () => {
		if(features)
		{
			if(features.length > 1)
			{
				features.sort((a, b) => new Date(a._creationDate) < new Date(b._creationDate) ? -1 : 1);

				const top = features.reduce((a, b) => a._upvotes >= b._upvotes ? a : b);
				features.splice(0, 0, features.splice(features.indexOf(top), 1)[0]);
			}
		}
	}

	/**
	 * Logs the user in anonymously 
	 */
	const authentificate = () => {
		firebase.auth().signInAnonymously()
		.then(() => {
			
		})
		.catch((error) => {
			var errorMessage = error.message;
			console.error(errorMessage);
		});

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var uid = user.uid;
				dispatch(setUserId(uid));
			}
		});
	}

	/**
	 * Connects to the database by subscribing to features adding / changes
	 */
	const connect = async() => {
		try{
			// First, loads the existing features in the database at once, and adds them to the state
			await database.ref('/features').once('value', snapshot => {
				if(snapshot.exists()){
					dispatch(addFeatures(snapshot.val()));
				}
			});
			// Then listen to every new entry in the database and adds the single feature
			await database.ref('/features').on('child_added', snapshot => {
				if(snapshot.exists()){
					dispatch(addFeature(snapshot.val()));
				}
			});
			// Finally listen to every changes on the existing database objects
			await database.ref('features').on('child_changed', snapshot => {
				if(snapshot.exists()){
					dispatch(updateFeature(snapshot.val()));
				}
			})
		} catch(e) {
			console.error(e);
		}
	}

	const history = useHistory();

	useEffect(() => connect(), []);
	useEffect(() => authentificate(), []);

	sort();

	return (
		<div style={{maxWidth: 90 + 'vw'}}>
		<div className="ui hidden divider"></div>
			<h1 style={{fontSize: 3 + 'em'}}>User feedback</h1>
			<div className="ui message">
				<h1>Want to give us your ideas ?</h1>
				<button className="ui button" onClick={() => history.push("/suggest")}>Suggest feedback</button>
			</div>
			<div>
				{features.map(feature => (
				<FeatureDetail key={feature._id} id={feature._id} />))}
				
				<div className="ui hidden divider"></div>
			</div>
		</div>
	)
}

export default FeatureList;