/**
 * WordPress dependencies
 */
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import {
	store as blockEditorStore,
	__experimentalBlockPatternsList as BlockPatternsList,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useAsyncList } from '@wordpress/compose';

function useStarterPatterns( postType ) {
	// A pattern is a start pattern if it includes 'core/post-content' in its blockTypes,
	// and it has no postTypes declared and the current post type is page or if
	// the current post type is part of the postTypes declared.
	const blockPatternsWithPostContentBlockType = useSelect(
		( select ) =>
			select( blockEditorStore ).getPatternsByBlockTypes(
				'core/post-content'
			),
		[]
	);

	return useMemo( () => {
		// filter patterns without postTypes declared if the current postType is page
		// or patterns that declare the current postType in its post type array.
		return blockPatternsWithPostContentBlockType.filter( ( pattern ) => {
			return (
				( postType === 'page' && ! pattern.postTypes ) ||
				( Array.isArray( pattern.postTypes ) &&
					pattern.postTypes.includes( postType ) )
			);
		} );
	}, [ postType, blockPatternsWithPostContentBlockType ] );
}

export default function StarterPatternsModal( { onChoosePattern, postType } ) {
	const [ isClosed, setIsClosed ] = useState( false );
	const starterPatterns = useStarterPatterns( postType );
	const shownStarterPatterns = useAsyncList( starterPatterns );

	if ( starterPatterns.length === 0 || isClosed ) {
		return null;
	}

	return (
		<Modal
			className="editor-starter-patterns__modal"
			title={ __( 'Choose a pattern' ) }
			isFullScreen
			onRequestClose={ () => setIsClosed( true ) }
		>
			<div className="editor-starter-patterns__modal-content">
				<BlockPatternsList
					blockPatterns={ starterPatterns }
					shownPatterns={ shownStarterPatterns }
					onClickPattern={ ( pattern, blocks ) => {
						onChoosePattern( pattern, blocks );
						setIsClosed( true );
					} }
				/>
			</div>
		</Modal>
	);
}
