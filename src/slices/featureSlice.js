import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux reducer for features related actions
 */
export const featureSlice = createSlice({
	name: 'features',
	initialState: {
		// List of features
		list: [],
		// User ID
		userId: null,
	},
	reducers: {
		/**
		 * Adds all the features in the action.payload to the Redux state, whithout duplicates
		 * @param {The current Redux state} state 
		 * @param {The action} action 
		 */
		addFeatures: (state, action) => {
			let features = action.payload;
			let keys = Object.keys(features);
			keys.forEach(key => {
				// Verify the feature doesn't exist in the list before adding it, avoids duplication
				if(state.list.find(el => el._id === key) === undefined)
				{
					state.list = state.list.concat(features[key]);
				}
				else{
					console.log('feature already existing');
				}
			});
		},
		/**
		 * Adds the feature in the action.payload to the Redux state, without duplicates
		 * @param {The current Redux state} state 
		 * @param {The action} action 
		 */
		addFeature: (state, action) => {
			if(state.list.find(el => el._id === action.payload._id) === undefined)
			{
				state.list = state.list.concat(action.payload);
			}
			else {
				console.log("feature already existing");
			}
		},
		/**
		 * Updates the feature contained in action.payload in the current Redux state
		 * @param {The current Redux state} state 
		 * @param {The action} action 
		 */
		updateFeature: (state, action) => {
			const feature = state.list.find((f) => f._id === action.payload._id);
			if(feature)
			{
				feature._upvotes = action.payload._upvotes;
				feature._voters = action.payload._voters;
			}
		},
		/**
		 * Sets the user ID after anonymous connection in the Redux state
		 * @param {The current Redux state} state 
		 * @param {The action} action 
		 */
		setUserId: (state, action) => {
			state.userId = action.payload;
		},
		/**
		 * Adds an upvote to a feature in the Redux state
		 * @param {The current Redux state} state 
		 * @param {The action} action 
		 */
		addUpvote: (state, action) => {
			state.list.find((feature) => feature._id === action.payload.id)._upvotes = action.payload.upvotes;
		},
	},
});

export const { addFeature, addUpvote, addFeatures, setUserId, updateFeature } = featureSlice.actions;

const {createSelector} = require('reselect');

const selectAllFeatures = state => state.features.list;

/**
 * Selector to retrieves all features in the Redux state
 */
export const selectFeatures = createSelector(
	selectAllFeatures,
	features => features
);

const selectFeatureById = id => state => state.features.list.find(el => el._id === id);

/**
 * Selector to retrieve a feature details by ID
 * @param {Feature ID} id 
 * @returns 
 */
export const selectFeature = id => createSelector(
	selectFeatureById(id),
	feature => feature
);

const hasUserUpvotedFeatureById = id => state => 
{
	const feature = state.features.list.find(el => el._id === id);
	if(feature)
	{
		return feature._voters.indexOf(state.features.userId) !== -1;
	}
	return false;
}

/**
 * Selector to know if the user voted for a particular feature
 * @param {Feature ID} id 
 * @returns 
 */
export const hasUserUpvotedFeature = id => createSelector(
	hasUserUpvotedFeatureById(id),
	hasVoted => hasVoted
);

const getUserAuthId = state => state.features.userId;

/**
 * Selector to retrieve the user ID
 */
export const getUserId = createSelector(
	getUserAuthId,
	userId => userId
);

export default featureSlice.reducer;