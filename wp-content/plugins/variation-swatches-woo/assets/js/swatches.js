( function ( $ ) {
	const removeAttrClass =
		cfvsw_swatches_settings.remove_attr_class + ' cfvsw-excluded';

	$( document ).on( 'click', '.cfvsw-swatches-option', function () {
		onClickSwatchesOption( $( this ) );
	} );

	$( 'body' ).on(
		'click',
		'.cfvsw_ajax_add_to_cart.cfvsw_variation_found',
		function ( e ) {
			e.preventDefault();
			triggerAddToCart( $( this ) );
		}
	);

	function onClickSwatchesOption( swatch ) {
		if ( swatch.hasClass( 'cfvsw-excluded' ) ) {
			return;
		}

		if ( swatch.hasClass( 'cfvsw-selected-swatch' ) ) {
			swatch.removeClass( 'cfvsw-selected-swatch' );
			resetPrice( swatch );
			resetThumbnail( swatch );
			resetButtonData( swatch );
		} else {
			const parent = swatch.parent();
			parent.find( '.cfvsw-swatches-option' ).each( function () {
				$( this ).removeClass( 'cfvsw-selected-swatch' );
			} );

			swatch.addClass( 'cfvsw-selected-swatch' );
		}

		updateSelectOption( swatch );
		if ( cfvsw_swatches_settings.html_design !== 'inline' ) {
			updateTitle( swatch );
		}
	}

	function updateSelectOption( swatch ) {
		const value = swatch.hasClass( 'cfvsw-selected-swatch' )
			? swatch.data( 'slug' )
			: '';
		const select = swatch
			.closest( '.cfvsw-swatches-container' )
			.prev()
			.find( 'select' );
		select.val( value ).change();
	}

	function updateTitle( swatch ) {
		const label = swatch.closest( 'tr' ).children( '.label' );
		label.find( '.cfvsw-selected-label' ).remove();

		if ( ! swatch.hasClass( 'cfvsw-selected-swatch' ) ) {
			return;
		}

		label
			.children( 'label' )
			.append( '<span class="cfvsw-selected-label"></span>' );
		label
			.children( 'label' )
			.children( '.cfvsw-selected-label' )
			.html( swatch.data( 'title' ) );
	}

	function triggerAddToCart( variant ) {
		if ( variant.is( '.wc-variation-is-unavailable' ) ) {
			return window.alert( cfvsw_swatches_settings.unavailable_text );
		}

		const productId = variant.data( 'product_id' );
		const variationId = variant.data( 'variation_id' );

		if (
			isNaN( productId ) ||
			productId === 0 ||
			isNaN( variationId ) ||
			variationId === 0
		) {
			return true;
		}

		const variation = variant.data( 'selected_variant' );

		const data = {
			action: 'cfvsw_ajax_add_to_cart',
			security: cfvsw_swatches_settings.ajax_add_to_cart_nonce,
			product_id: productId,
			variation_id: variationId,
			variation,
		};

		$( document.body ).trigger( 'adding_to_cart', [ variant, data ] );

		variant.removeClass( 'added' ).addClass( 'loading' );

		// Ajax add to cart request
		$.ajax( {
			type: 'POST',
			url: cfvsw_swatches_settings.ajax_url,
			data,
			dataType: 'json',
			success( response ) {
				if ( ! response ) {
					return;
				}

				if ( response.error && response.product_url ) {
					window.location = response.product_url;
					return;
				}

				// Trigger event so themes can refresh other areas.
				$( document.body ).trigger( 'added_to_cart', [
					response.fragments,
					response.cart_hash,
					variant,
				] );
				$( document.body ).trigger( 'update_checkout' );

				variant.removeClass( 'loading' ).addClass( 'added' );
			},
			error( errorThrown ) {
				variant.removeClass( 'loading' );
				console.log( errorThrown );
			},
		} );
	}

	$( '.cfvsw-hidden-select select' ).on( 'change', function () {
		setTimeout( () => {
			updateSwatchesAvailability();
		}, 1 );
	} );

	$( '.reset_variations' ).on( 'click', function () {
		resetSwatches();
	} );

	$( document ).on( 'ready', function () {
		setTimeout( () => {
			setSwatchesSelection();
		}, 1 );

		$( '.cfvsw-swatches-option' ).on( 'mouseover', function () {
			const tooltip = $( this ).data( 'tooltip' );
			if (
				'' === tooltip ||
				'undefined' === typeof tooltip ||
				$( this ).hasClass( 'cfvsw-label-option' )
			) {
				return;
			}

			if ( $( this ).children( '.cfvsw-tooltip' ).length === 0 ) {
				$( this ).prepend( "<div class='cfvsw-tooltip'></div>" );
				$( '.cfvsw-tooltip' )
					.html(
						'<span class="cfvsw-tooltip-label">' +
							tooltip +
							'</span>'
					)
					.fadeIn( 500 );

				const swatchHeight = $( this )
					.children( '.cfvsw-swatch-inner' )
					.innerHeight();
				$( '.cfvsw-tooltip' ).css( {
					bottom: swatchHeight,
				} );
				if (
					cfvsw_swatches_settings.tooltip_image &&
					$( this ).hasClass( 'cfvsw-image-option' )
				) {
					$( '.cfvsw-tooltip' ).prepend(
						"<span class='cfvsw-tooltip-preview'></span>"
					);
					const preview = $( this )
						.children( '.cfvsw-swatch-inner' )
						.css( 'backgroundImage' );
					$( '.cfvsw-tooltip' ).css( {
						bottom: swatchHeight - 30,
						padding: '2px',
					} );
					$( '.cfvsw-tooltip-preview' ).css( {
						backgroundImage: preview,
						backgroundSize: 'cover',
					} );
				}
			}
		} );

		$( '.cfvsw-swatches-option' ).on( 'mouseleave', function () {
			$( '.cfvsw-tooltip' ).remove();
		} );

		$( '.woocommerce-widget-layered-nav-list' ).each( function () {
			if ( $( this ).find( '.cfvsw-swatches-container' ).length ) {
				$( this ).addClass( 'cfvsw-filters' );
			}
		} );
	} );

	$( '.cfvsw-shop-variations' ).on( 'click', function ( e ) {
		e.preventDefault();
	} );

	$( '.cfvsw-shop-variations .cfvsw-more-link' ).on( 'click', function ( e ) {
		window.location = e.target.href;
	} );

	function updateSwatchesAvailability() {
		$( '.cfvsw-hidden-select select' ).each( function () {
			const availableOptions = [];
			$( this )
				.children( 'option' )
				.each( function () {
					if ( '' !== $( this ).val() ) {
						availableOptions.push( $( this ).val() );
					}
				} );
			$( this )
				.parent()
				.next()
				.find( '.cfvsw-swatches-option' )
				.each( function () {
					if (
						-1 ===
						$.inArray(
							$( this ).attr( 'data-slug' ),
							availableOptions
						)
					) {
						$( this ).addClass( removeAttrClass );
					} else {
						$( this ).removeClass( removeAttrClass );
					}
				} );
		} );
	}

	function setSwatchesSelection() {
		$( '.cfvsw-hidden-select select' ).each( function () {
			const selected = $( this ).val();
			$( this )
				.parent()
				.next()
				.find( `[data-slug='${ selected }']` )
				.trigger( 'click' );
		} );
	}

	function resetSwatches() {
		$( '.cfvsw-swatches-option' ).each( function () {
			$( this ).removeClass( 'cfvsw-selected-swatch' );
		} );
		$( '.cfvsw-selected-label' ).remove();
	}

	$( window ).load( function () {
		$( '.cfvsw_variations_form' ).each( function () {
			$( this ).on( 'found_variation', function ( e, variation ) {
				updateThumbnail( $( this ), variation.image );
				updatePrice( $( this ), variation );
				updatebuttonData( $( this ), variation );
			} );
		} );
	} );

	function updateThumbnail( swatch, imageData ) {
		const thumbnail = swatch.parents( 'li' ).find( 'img:first' );
		if (
			0 ===
			swatch.parents( 'li' ).find( '.cfvsw-original-thumbnail' ).length
		) {
			const originalThumbnail = thumbnail.clone();
			thumbnail.after( '<span class="cfvsw-original-thumbnail"></span>' );
			$( '.cfvsw-original-thumbnail' ).html( originalThumbnail );
		}
		thumbnail.attr( 'src', imageData.src );
		thumbnail.attr( 'srcset', imageData.srcset );
	}

	function resetThumbnail( swatch ) {
		if (
			swatch.parents( 'li' ).find( '.cfvsw-original-thumbnail' ).length
		) {
			const thumbnail = swatch.parents( 'li' ).find( 'img:first' );
			thumbnail.replaceWith(
				swatch
					.parents( 'li' )
					.find( '.cfvsw-original-thumbnail' )
					.html()
			);
			$( '.cfvsw-original-thumbnail' ).remove();
		}
	}

	function updatePrice( swatch, variation ) {
		if ( swatch.parents( 'li' ).find( '.cfvsw-original-price' ).length ) {
			const price = swatch.parents( 'li' ).find( '.price' );
			price.replaceWith( variation.price_html );
		} else {
			const price = swatch.parents( 'li' ).find( '.price' );
			price.after( variation.price_html );
			price.removeClass( 'price' ).addClass( 'cfvsw-original-price' );
		}
	}

	function resetPrice( swatch ) {
		if ( swatch.parents( 'li' ).find( '.cfvsw-original-price' ).length ) {
			swatch.parents( 'li' ).find( '.price' ).remove();
			swatch
				.parents( 'li' )
				.find( '.cfvsw-original-price' )
				.removeClass( 'cfvsw-original-price' )
				.addClass( 'price' );
		}
	}

	function updatebuttonData( variant, variation ) {
		const select = variant.find( '.variations select' );
		const data = {};
		const button = variant
			.parents( 'li' )
			.find( '.cfvsw_ajax_add_to_cart' );

		select.each( function () {
			const attributeName =
				$( this ).data( 'attribute_name' ) || $( this ).attr( 'name' );
			const value = $( this ).val() || '';
			data[ attributeName ] = value;
		} );

		button.html( button.data( 'add_to_cart_text' ) );
		button.addClass( 'cfvsw_variation_found' );
		button.attr( 'data-variation_id', variation.variation_id );
		button.attr( 'data-selected_variant', JSON.stringify( data ) );
	}

	function resetButtonData( variant ) {
		const button = variant
			.parents( 'li' )
			.find( '.cfvsw_ajax_add_to_cart' );
		button.html( button.data( 'select_options_text' ) );
		button.removeClass( 'cfvsw_variation_found' );
		button.attr( 'data-variation_id', '' );
		button.attr( 'data-selected_variant', '' );
	}
} )( jQuery );
