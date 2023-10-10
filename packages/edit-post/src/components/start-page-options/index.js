/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useState } from '@wordpress/element';
import { StarterPatternsModal } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';

export default function StartPageOptions() {
	const [ isClosed, setIsClosed ] = useState( false );
	const { resetEditorBlocks } = useDispatch( editorStore );
	const postType = useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	);
	const shouldEnableModal = useSelect( ( select ) => {
		const { isCleanNewPost } = select( editorStore );
		const { isEditingTemplate, isFeatureActive } = select( editPostStore );

		return (
			! isEditingTemplate() &&
			! isFeatureActive( 'welcomeGuide' ) &&
			isCleanNewPost()
		);
	}, [] );

	if ( isClosed || ! shouldEnableModal ) {
		return null;
	}

	return (
		<StarterPatternsModal
			postType={ postType }
			onChoosePattern={ ( pattern, blocks ) => {
				resetEditorBlocks( blocks );
				setIsClosed( true );
			} }
			onRequestClose={ () => setIsClosed( true ) }
		/>
	);
}
