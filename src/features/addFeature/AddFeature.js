import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../firebase/firebase';
import 'firebase/database';
import { Form } from 'semantic-ui-react'
import { toast } from 'react-toastify';

/**
 * Fragment that allows the user to add a feature to the database, which then displays it on the feature list
 * @returns the HTML code of the fragment
 */
function AddFeature() {

	let title, content;

	/**
	 * Performs basic verifications on the fields, such as a sufficient length for both title and content
	 */
	const Suggest = () => {
		if(!title)
		{
			toast('Please give your feedback a title.');
		}
		else if(title.length <= 4) {
			toast('The title of your feedback must be at least 5 characters long.')
		}
		if(!content)
		{
			toast('Please describe your feedback.');
		}
		else if(content.length <= 64) {
			toast('Please describe your feedback more in details.');
		}
		else try {
			// Generate a unique UUID for the feature, which will be its key
			const id = uuidv4();
			const upvotes = 0;

			// Create the feature
			const feature = {
				_id: id,
				_title: title,
				_content: content,
				_upvotes: upvotes,
				_voters: [0],
				_creationDate: new Date().toISOString(),
			}

			// Send the feature to the database
			database.ref('/features/' + id).set(feature)
			window.location.href = "/";

		} catch(e) {
			console.error(e);
			toast('Oops... something went wrong, please try again !');
		}
	}

	return (
		<div style={{minWidth: 40 + 'vw', maxWidth: 90 + 'vw'}}>
			<div className="ui very padded raised segment">
				<h1 className="ui header">Suggest a feature</h1>
				<div className="ui fluid labeled input">
					<div className="ui label">Title</div> 
					<input tabIndex={0} className="ui fluid input" type="text" placeholder={"Title of the feature"} onChange={(e) => title = e.target.value} maxLength={64}></input>
				</div>
				<div className="ui hidden divider"></div>
				<Form>
					<textarea style={{minHeight: 15 + 'em'}} className="ui" placeholder={"Description of the feature"} onChange={(e) => content = e.target.value} maxLength={1024} />
				</Form>
				<div className="ui hidden divider"></div>
				<button className="ui button" onClick={() => Suggest()}>Save</button>
			</div>
			<div className="ui raised padded segment">
				<button className="ui button" onClick={() => window.location.href = "/"}>Cancel</button>
			</div>
		</div>
	)
}

export default AddFeature;