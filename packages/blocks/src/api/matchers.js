/**
 * External dependencies
 */
export { attr, prop, text, query } from 'hpq';

/**
 * WordPress dependencies
 */
import { __unstableCreateRichTextString, create } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
export { matcher as node } from './node';
export { matcher as children } from './children';

export function html( selector, multilineTag, preserveWhiteSpace ) {
	return ( domNode ) => {
		let match = domNode;

		if ( selector ) {
			match = domNode.querySelector( selector );
		}

		if ( ! match ) {
			return '';
		}

		if ( multilineTag ) {
			let value = '';
			const length = match.children.length;

			for ( let index = 0; index < length; index++ ) {
				const child = match.children[ index ];

				if ( child.nodeName.toLowerCase() !== multilineTag ) {
					continue;
				}

				value += child.outerHTML;
			}

			return value;
		}

		return __unstableCreateRichTextString( {
			// This is faste because we don't need to parse the HTML string.
			value: create( { element: match } ),
			multilineTag,
			preserveWhiteSpace,
		} );
	};
}
