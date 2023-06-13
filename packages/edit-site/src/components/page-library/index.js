/**
 * WordPress dependencies
 */
import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Page from '../page';
import PatternsList from './patterns-list';
import useLibrarySettings from './use-library-settings';
import { unlock } from '../../lock-unlock';

const { ExperimentalBlockEditorProvider } = unlock( blockEditorPrivateApis );

const DEFAULT_TYPE = 'wp_template_part';
const DEFAULT_CATEGORY = 'header';

export default function PageLibrary() {
	const { categoryType, categoryId } = getQueryArgs( window.location.href );
	const type = categoryType || DEFAULT_TYPE;
	const category = categoryId || DEFAULT_CATEGORY;
	const settings = useLibrarySettings();

	// Wrap everything in a block editor provider.
	// This ensures 'styles' that are needed for the previews are synced
	// from the site editor store to the block editor store.
	return (
		<ExperimentalBlockEditorProvider settings={ settings }>
			<Page className="edit-site-library">
				<PatternsList
					type={ type }
					categoryId={ category }
					label={ __( 'Patterns list' ) }
				/>
			</Page>
		</ExperimentalBlockEditorProvider>
	);
}
