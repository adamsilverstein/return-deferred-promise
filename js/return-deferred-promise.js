$( document ).ready( function(){
	var deferredBox, allThePromises, x,
		colors = new Array( 'red', 'green', 'blue', 'yellow', 'purple', 'black' ),

	randomColor = function() {
		return colors[ _.random( 0, colors.length - 1 ) ];
	},

	randomPosition = function(){
				return _.random( 0, 9 ) * 50;
	};

	function addDeferredBox(){
		var thisBox, horizontalPlusorminus, verticalPlusorminus, newColor, position,
			deferred = $.Deferred(),
			key = _.random( 1111111111, 9999999999 );

		$( '.inside' ).append( '<div class="deferred-box ' + key + '" style="left:' + randomPosition() +
								'px; top: ' + randomPosition() + 'px;"></div>' );
		thisBox = $( '.' + key );
		thisBox.fadeOut().fadeIn( _.random( 500, 3000 ) );

		thisBox
		.on( 'click', function(){
			$this = $( this );
			newColor = randomColor();
			if ( 'resolved' !== deferred.state() ){
				if ( 'rgb(0, 0, 0)' === newColor || 'black' === newColor ) {
					$this.css( 'background-color', newColor );
					deferred.resolve();
				} else {
					$this.css( 'background-color', newColor );
				}
			}
		})
		.on( 'mouseover', function( event ){
			event.stopPropagation();
			if ( 'resolved' !== deferred.state() ){
				horizontalPlusorminus = ( 0 == _.random( 0, 1 ) ? '+' : '-' );
				$this = $( this );
				position = $this.offset();
				horizontalPlusorminus = 50 >= position.left ? '+' : horizontalPlusorminus;
				horizontalPlusorminus = 449 < position.left ? '-' : horizontalPlusorminus;
				verticalPlusorminus = ( 0 == _.random( 0, 1 ) ? '+' : '-' );
				verticalPlusorminus = 50 >= position.top ? '+' : verticalPlusorminus;
				verticalPlusorminus = 440 < position.top ? '-' : verticalPlusorminus;

				$this.animate({
					'left': horizontalPlusorminus + '=50px',
					'top':  verticalPlusorminus   + '=50px'
					 }, 1000 );
			}
		});
		return deferred.promise();
	}

	// Main function add some boxes
	console.log ( 'adding boxes...' );
	for( x = 0; x < _.random( 3, 6 ); x++ ){
		deferredBox = addDeferredBox();
		if ( 'undefined' === typeof allThePromises ) {
			allThePromises = $.when( deferredBox );
		} else {
			allThePromises = $.when( deferredBox, allThePromises );
		}
		deferredBox.done( function(){

		});
	}

	allThePromises.done( function(){
		console.log( 'finished!' );
		console.log( this );
		$( '.inside' ).animate({ borderRightWidth: "15px" }, 1500 );
	})

});