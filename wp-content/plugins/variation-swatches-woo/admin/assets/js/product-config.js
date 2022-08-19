( function ( $ ) {
	const SWATCHES_PRODUCT = {
		init() {
			SWATCHES_PRODUCT.Events();
			$( '.cfvsw-attribute-item-color' ).wpColorPicker();
		},
		ajx: ( data ) => {
			const ajaxObj = {
				method: 'POST',
				url: cfvsw_swatches_product.ajax_url,
				data,
				dataType: 'json',
				processData: false,
				contentType: false,
			};
			return jQuery.ajax( ajaxObj );
		},
		addSectionLoader: ( section = null ) => {
			if ( section ) {
				section.block( {
					message: null,
					overlayCSS: {
						background: '#dddddd',
						opacity: 0.5,
					},
				} );
			}
		},
		openCloseArrow: ( thisHandle ) => {
			const getClosestContainer = thisHandle.closest( '.postbox' );
			thisHandle.removeClass( 'open close' );
			if ( getClosestContainer.hasClass( 'open' ) ) {
				thisHandle.addClass( 'open' );
			} else {
				thisHandle.addClass( 'close' );
			}
		},
		changeSelect() {
			const currenctSelect = $( this );
			const getContainer = currenctSelect.closest(
				'.cfvsw-attribute-wrapper'
			);
			const value = currenctSelect.val();
			getContainer.find( '.cfvsw-attribute-item-container' ).hide();
			if ( 'color' === value || 'image' === value || 'label' === value ) {
				getContainer.find( `[data-container="${ value }"]` ).show();
			}

			const getNameAttr = currenctSelect.attr( 'data-name' );
			const getHiddenInput = getContainer.find(
				`input[name="${ getNameAttr }"]`
			);
			getHiddenInput.val( value );
		},
		saveSwatches() {
			const button = $( this );
			const container = button.closest( '.cfvsw-swatches-settings' );
			const action = container.find( 'input[name="swatches_action"]' );
			if ( action.length && action.length > 0 ) {
				const actionValue = action.val();
				if ( ! actionValue || '' === actionValue ) {
					return;
				}
				SWATCHES_PRODUCT.addSectionLoader( container );
				const getSection = button
					.closest( '.cfvsw-swatches-settings' )
					.find( '.cfvsw-swatches-input-section' );
				const getSectionHtml = getSection.clone();
				const form = $( '<form></form>' );
				form.hide();
				form.append( getSectionHtml );
				$( 'body' ).append( form );
				setTimeout( () => {
					const formData = new FormData( form[ 0 ] );
					formData.append( 'action', actionValue );
					form.remove();
					const putContent = SWATCHES_PRODUCT.ajx( formData );
					putContent.success( function ( response ) {
						container.unblock();
						if ( response.data.message ) {
							SWATCHES_PRODUCT.setSuccessMessage(
								response.data.message
							);
						}
					} );
				}, 100 );
			}
		},
		update_swatches_reset_data: ( toDo = 'update' ) => {
			// Collect data.
			const getWrapper = $( '.cfvsw-swatches-settings' );
			if (
				! getWrapper ||
				! getWrapper.length ||
				! getWrapper.length > 0
			) {
				return;
			}
			const getInputContainer = getWrapper.find(
				'.cfvsw-swatches-input-section'
			);
			const putTemplate = getInputContainer.find(
				'.cfvsw-swatches-taxonomy-section'
			);
			const getButtonContainer = getWrapper.find(
				'.cfvsw-save-reset-swatches'
			);

			const getProductId = getInputContainer
				.children( 'input[name="product_id"]' )
				.val();
			const security = getInputContainer
				.children( 'input[name="security"]' )
				.val();
			if (
				getProductId &&
				'' !== getProductId &&
				security &&
				'' !== security &&
				putTemplate.length > 0
			) {
				const formData = new FormData();
				formData.append( 'security', security );
				formData.append( 'product_id', getProductId );
				if ( 'reset' === toDo ) {
					formData.append(
						'action',
						'cfvsw_reset_product_swatches_data'
					);
				} else {
					formData.append(
						'action',
						'cfvsw_update_product_swatches_data'
					);
				}
				SWATCHES_PRODUCT.addSectionLoader( getWrapper );
				const putContent = SWATCHES_PRODUCT.ajx( formData );
				putContent.success( function ( response ) {
					getWrapper.unblock();
					if (
						response.success &&
						response.data &&
						response.data.template &&
						'' !== response.data.template
					) {
						putTemplate.html( response.data.template );
						SWATCHES_PRODUCT.setSuccessMessage(
							response.data.message
						);
						$( '.wc-enhanced-select' ).select2( {
							minimumResultsForSearch: Infinity,
						} );
						$( '.cfvsw-attribute-item-color' ).wpColorPicker();
						if ( getButtonContainer.hasClass( 'hidden-buttons' ) ) {
							getButtonContainer.removeClass( 'hidden-buttons' );
						}
					}
					// When no attribute available.
					if ( '' === response.data.template ) {
						putTemplate.html(
							`<p class="cfvsw-swatches-no-visible-attr">${ response.data.message }</p>`
						);
						getButtonContainer.addClass( 'hidden-buttons' );
					}
				} );
			}
		},
		setSuccessMessage: ( message ) => {
			const warpper = $( '.cfvsw-swatches-settings-notice' );
			warpper.addClass( 'notice notice-success' );
			warpper.children( 'p' ).html( message );
			warpper.show();
			setTimeout( () => {
				warpper.slideUp();
			}, 2000 );
		},
		removeSwatchesImage() {
			const removeBtn = $( this );
			const getContainer = removeBtn.closest( '.field-image' );
			const previewImage = getContainer.find( '.cfvsw-image-preview' );
			getContainer
				.find( '.cfvsw-image-preview' )
				.attr( 'src', previewImage.attr( 'data-placeholder-image' ) );
			getContainer.find( '.cfvsw-save-image' ).val( '' );
			removeBtn.hide();
		},
		Events() {
			$( document ).on(
				'change',
				'.cfvsw-attribute-type-select',
				SWATCHES_PRODUCT.changeSelect
			);
			// Save swatches.
			$( document ).on(
				'click',
				'.cfvsw-save-swatches',
				SWATCHES_PRODUCT.saveSwatches
			);
			// Reset swatches.
			$( document ).on( 'click', '.cfvsw-reset-swatches', function () {
				SWATCHES_PRODUCT.update_swatches_reset_data( 'reset' );
			} );
			// Update swatches in reload.
			$( 'body' ).on( 'reload', function () {
				SWATCHES_PRODUCT.update_swatches_reset_data();
			} );
			// Remove image.
			$( document ).on(
				'click',
				'.cfvsw_remove_image_attr_item',
				SWATCHES_PRODUCT.removeSwatchesImage
			);
			$( document ).on(
				'click',
				'.cfvsw-swatches-taxonomy-section .handlediv',
				function () {
					const thisHandle = $( this );
					SWATCHES_PRODUCT.openCloseArrow( thisHandle );
				}
			);
			$( document ).on(
				'click',
				'.cfvsw-swatches-taxonomy-section .cfvsw-attribute-heading',
				function () {
					const thisHandle = $( this );
					const getTogglebtn = thisHandle.find( '.handlediv' );
					SWATCHES_PRODUCT.openCloseArrow( getTogglebtn );
				}
			);
			// Image Upload.
			let fileFrame;
			let currentButton;
			$( document ).on(
				'click',
				'.cfvsw_upload_image_attr_item',
				function ( event ) {
					currentButton = $( this );
					event.preventDefault();
					// If the media frame already exists, reopen it.
					if ( fileFrame ) {
						// Open frame.
						fileFrame.open();
						return;
					}
					// Create the media frame.
					fileFrame = wp.media.frames.fileFrame = wp.media( {
						title: cfvsw_swatches_product.image_upload_text.title,
						button: {
							text:
								cfvsw_swatches_product.image_upload_text
									.button_title,
						},
						multiple: false, // Set to true to allow multiple files to be selected
					} );
					// When an image is selected, run a callback.
					fileFrame.on( 'select', function () {
						// We set multiple to false so only get one image from the uploader
						const attachment = fileFrame
							.state()
							.get( 'selection' )
							.first()
							.toJSON();
						const attachmentUrl = attachment.url;
						const getContainer = currentButton.closest(
							'.field-image'
						);
						getContainer
							.find( '.cfvsw-image-preview' )
							.attr( 'src', attachmentUrl );

						getContainer
							.find( '.cfvsw-save-image' )
							.val( attachment.id );
						getContainer
							.find( '.cfvsw_remove_image_attr_item' )
							.show();
					} );
					// Finally, open the modal
					fileFrame.open();
				}
			);
		},
	};
	SWATCHES_PRODUCT.init();
} )( jQuery );
