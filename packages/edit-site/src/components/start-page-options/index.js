/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { StarterPatternsModal } from '@wordpress/block-editor';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';
import { store as coreStore, useEntityBlockEditor } from '@wordpress/core-data';

function StartPageOptionsModal( { postType } ) {
	const [ , , onChange ] = useEntityBlockEditor( 'postType', postType );
	return (
		<StarterPatternsModal
			postType={ postType }
			onChoosePattern={ ( pattern, blocks ) => onChange( blocks ) }
		/>
	);
}

export default function StartPageOptions() {
	const { shouldOpenModal, postType } = useSelect( ( select ) => {
		const { getEditedPostContext, hasPageContentFocus } =
			select( editSiteStore );
		const _hasPageContentFocus = hasPageContentFocus();
		const context = getEditedPostContext();
		const { hasEditsForEntityRecord } = select( coreStore );

		return {
			shouldOpenModal:
				_hasPageContentFocus &&
				! hasEditsForEntityRecord(
					'postType',
					context.postType,
					context.postId
				) &&
				! select( preferencesStore ).get(
					'core/edit-site',
					'welcomeGuide'
				),
			postType: context.postType,
		};
	}, [] );

	if ( ! shouldOpenModal ) {
		return null;
	}

	return <StartPageOptionsModal postType={ postType } />;
}
