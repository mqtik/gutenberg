/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore, StarterPatternsModal } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';

function StartPageOptionsModal() {
	const { resetEditorBlocks } = useDispatch( editorStore );
	const postType = useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	);

	return (
		<StarterPatternsModal
			postType={ postType }
			onChoosePattern={ ( pattern, blocks ) =>
				resetEditorBlocks( blocks )
			}
		/>
	);
}

export default function StartPageOptions() {
	const shouldEnableModal = useSelect( ( select ) => {
		const { isCleanNewPost } = select( editorStore );
		const { isEditingTemplate, isFeatureActive } = select( editPostStore );

		return (
			! isEditingTemplate() &&
			! isFeatureActive( 'welcomeGuide' ) &&
			isCleanNewPost()
		);
	}, [] );

	if ( ! shouldEnableModal ) {
		return null;
	}

	return <StartPageOptionsModal />;
}
