/**
 * WordPress dependencies
 */
import {
	__experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,
	SelectControl,
} from '@wordpress/components';
import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { cleanEmptyObject } = unlock( blockEditorPrivateApis );

export default ( { filter, view, onChangeView } ) => {
	return (
		<SelectControl
			value={ view.filters[ filter.id ] }
			prefix={
				<InputControlPrefixWrapper
					as="span"
					className="dataviews__select-control-prefix"
				>
					{ filter.name +
						( filter.type === 'enumeration_not_in'
							? ' ' + __( 'not' )
							: '' ) +
						':' }
				</InputControlPrefixWrapper>
			}
			options={ filter.elements }
			onChange={ ( value ) => {
				if ( value === '' ) {
					value = undefined;
				}

				onChangeView( ( currentView ) => ( {
					...currentView,
					filters: cleanEmptyObject( {
						...currentView.filters,
						[ filter.id ]: value,
					} ),
				} ) );
			} }
		/>
	);
};
