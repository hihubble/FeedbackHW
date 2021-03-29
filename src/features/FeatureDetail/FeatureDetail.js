import { selectFeature, hasUserUpvotedFeature, getUserId } from '../../slices/featureSlice';
import { useSelector } from 'react-redux';
import { database } from '../../firebase/firebase';

/**
 * Segment displaying a feature's information and allowing a user to upvote
 * @param {Parameters from the parent component, id: the feature id to display} props 
 * @returns the HTML code of the fragment
 */
function FeatureDetail(props) {

	const feature = useSelector(selectFeature(props.id));
	const userId = useSelector(getUserId);
	const userHasVoted = useSelector(hasUserUpvotedFeature(feature._id));

	/**
	 * Send an upvote to the database in transaction mode, plus add the user as a voter for this feature using their anonymous connection ID to prevent double voting
	 */
	const sendUpvote = () => {
		try {
			// First transaction : increment upvote for the feature in the database
			var upvoteCountRef = database.ref('features').child(feature._id).child('_upvotes');
			upvoteCountRef.transaction(function(currentUpvote) {
				return currentUpvote + 1;
			});

			// Second transaction : append user ID to the voters of the feature
			var votersRef = database.ref('features').child(feature._id).child('_voters');
			votersRef.transaction(function(currentVoters) {
				return currentVoters.concat(userId);
			});
		} catch(e) {
			console.error(e);
		}
	};

	return (
		<div className="ui padded raised segment">
				{!userHasVoted ? 
					<div className="ui right floated left labeled button">
						<a className="ui basic right pointing label" style={{minWidth: 4 + 'em'}}>
							{feature._upvotes}
						</a>
						<div onClick={(e) => {sendUpvote(feature._id)}} className="ui button">
							+1
						</div>
					</div>
				:
				<div className="ui right floated left labeled button">
					<a className="ui basic right pointing label" style={{minWidth: 4 + 'em'}}>
						{feature._upvotes}
					</a>
					<div className="ui button">
					<i className="check icon"></i>
					</div>
				</div>
				}
			<div className="ui left aligned container">
				<h2 className="header" style={{wordWrap: 'break-word'}}>{feature._title}</h2>
				<div className="description" style={{wordWrap: 'break-word'}}>
					{feature._content}
				</div>
			</div>
		</div>
	)
}

export default FeatureDetail;