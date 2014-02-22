$( document ).ready( function(){
	var deferredBox, allThePromises, x,
		colors = new Array( 'red', 'green', 'blue', 'yellow', 'purple', 'black' ),

	randomColor = function() {
		return colors[ _.random( 0, colors.length - 1 ) ];
	},

	randomPosition = function(){
				return _.random( 0, 9 ) * 50;
	};

	function startTimer() {
		var deferred = $.Deferred();

		setTimeout( function(){ tickTimer( deferred ); }, 1000 );
		return deferred;
	}

	function tickTimer( deferred ) {
		var $remaining = $( '.remaining' ),
			remaining = $remaining.text();

		if ( 'resolved' === allThePromises.state() ){
			return;
		}

		if ( remaining > 0 ){
			remaining--;
			$remaining.text( remaining );
			setTimeout( function(){ tickTimer( deferred ); }, 1000 );
		}
		if ( 0 === remaining ){
			deferred.reject(); // Game over!
		}
	}

	function addDeferredBox(){
		var thisBox, horizontalPlusorminus, verticalPlusorminus, newColor, position, moving = false,
			percentComplete,
			deferred = $.Deferred(), key = _.random( 1111111111111, 9999999999999 );

		$( '.inside' ).append( '<a href="#" class="deferred-box ' + key + '" style="left:' + randomPosition() +
								'px; top: ' + randomPosition() + 'px;"></a>' );
		thisBox = $( '.' + key );
		thisBox.fadeOut().fadeIn( _.random( 500, 3000 ) );

		thisBox
		.on( 'click', function(){
			$this = $( this );
			newColor = randomColor();
			if ( 'resolved' !== deferred.state() ){
				if ( 'rgb(0, 0, 0)' === newColor || 'black' === newColor ) {
					$this.css( 'background-color', newColor );
					deferred.notify();
					deferred.resolve();
				} else {
					$this.css( 'background-color', newColor );
				}
			}
		})
		.on( 'mouseenter', function( event ){
			event.stopPropagation();
			if ( ! moving ){
				moving = true;
				horizontalPlusorminus = ( 0 === _.random( 0, 1 ) ? '+' : '-' );
				$this = $( this );
				position = $this.offset();

				horizontalPlusorminus = 50 >= position.left ? '+' : horizontalPlusorminus;
				horizontalPlusorminus = 449 < position.left ? '-' : horizontalPlusorminus;
				verticalPlusorminus = ( 0 === _.random( 0, 1 ) ? '+' : '-' );
				verticalPlusorminus = 50 >= position.top ? '+' : verticalPlusorminus;
				verticalPlusorminus = 440 < position.top ? '-' : verticalPlusorminus;

				$this.delay( 500 ).animate({
					'left': horizontalPlusorminus + '=50px',
					'top':  verticalPlusorminus   + '=50px'
					}, 1000, function() {
						moving = false;
					} );
			}
		});
		return deferred.promise();
	}

	percentComplete = function(){
		var completed, total;

		completed = $( '.deferred-box' ).filter(function() {
						return ( 'rgb(0, 0, 0)' === $(this).css('background-color') );
					}).length;
		total = $( '.deferred-box' ).length;

		return ( completed / total * 100 ) + "%";

	};


	// Main function add some boxes
	console.log ( 'adding boxes...' );
	for( x = 0; x < _.random( 3, 4 ); x++ ){
		deferredBox = addDeferredBox();
		if ( 'undefined' === typeof allThePromises ) {
			allThePromises = $.when( deferredBox );
		} else {
			allThePromises = $.when( deferredBox, allThePromises );
		}
	}
	console.log ( 'starting timer...' );

	// Start the timer
	deferred = startTimer();
	deferred.fail( function(){
			console.log( 'Game over, you loose!' );
		});


	allThePromises.then(
		// done - you win
		function(){
			console.log( 'You Win!' );
			$( '.progress-complete' ).css( 'background-color', '#f00' );
		},
		// fail
		function(){},
		// progress - you are progressing
		function(){
			console.log( 'progress!' );
			$( '.progress-complete' ).animate( { width: percentComplete()  }, 500 );
		}
	);

});