/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import {
	store as blockEditorStore,
	StarterPatternsModal,
} from '@wordpress/block-editor';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import { store as editSiteStore } from '../../store';

export default function StartPageOptions() {
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const { shouldOpenModal, postType, rootClientId } = useSelect(
		( select ) => {
			// Check that a page is being edited in content focus mode, and the welcome guide isn't also open.
			const { hasPageContentFocus, getEditedPostContext } =
				select( editSiteStore );
			const context = getEditedPostContext();
			const isEditingPage =
				context?.postType === 'page' &&
				context?.postId &&
				hasPageContentFocus();
			const isWelcomeGuideOpen = select( preferencesStore ).get(
				'core/edit-site',
				'welcomeGuide'
			);
			if ( ! isEditingPage || isWelcomeGuideOpen ) {
				return { shouldOpenModal: false };
			}

			// Check if there's a page content block. Return early if there isn't.
			const { __experimentalGetGlobalBlocksByName, getBlock } =
				select( blockEditorStore );
			const [ contentBlockClientId ] =
				__experimentalGetGlobalBlocksByName( 'core/post-content' );
			if ( ! contentBlockClientId ) {
				return { shouldOpenModal: false };
			}

			// Check if there's inner blocks in the content block.
			const contentBlock = getBlock( contentBlockClientId );
			if ( contentBlock?.innerBlocks?.length ) {
				return { shouldOpenModal: false };
			}

			return {
				shouldOpenModal: true,
				postType: context.postType,
				rootClientId: contentBlockClientId,
			};
		},
		[]
	);

	if ( ! shouldOpenModal ) {
		return null;
	}

	return (
		<StarterPatternsModal
			postType={ postType }
			rootClientId={ rootClientId }
			onChoosePattern={ ( pattern, blocks ) =>
				replaceInnerBlocks( rootClientId, blocks )
			}
		/>
	);
}
