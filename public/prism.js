
console.log("read prisom");

//------------------------------------------------------------------------------------------------------------------------------

	Utils = {}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Utils.Elements = {} ;

	Utils.Elements.appendChildren = function( $parent , $children )
	{
		for( var $i in $children )
		{
			$parent.appendChild( $children[$i] ) ;
		}
	}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Utils.Array = {}

	Utils.Array.out = function( $arr , $target )
	{
		var $length = $arr.length ;
		var $check ;
		var $i ;

		for( $i = 0 ; $i < $length ; $i++ )
		{
			$check = $arr[ $i ] ;
			if( $check == $target )
			{
				$arr.splice( $i , 1 ) ;
				$i -- ;
				$length -- ;
			}
		}
	}

	Utils.Array.outByParam = function( $arr , $paramName , $value )
	{
		var $length = $arr.length ;
		var $check ;
		var $i ;

		for( $i = 0 ; $i < $length ; $i++ )
		{
			$check = $arr[ $i ] ;
			if( $check[$paramName] == $value )
			{
				$arr.splice( $i , 1 ) ;
				$i -- ;
				$length -- ;
			}
		}
	}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Utils.setParams = function( $target , $initObj )
	{
		if( $target instanceof Array )
		{
			for( var $i in $target )		Utils.setParams( $target[$i] , $initObj ) ;
			return ;
		}

		//    -    -    -    -    -    -    -    -    -

		if( $target && $initObj )
		{
			for( var $paramStr in $initObj )
			{
				if( String( $target[$paramStr] ) != "undefined" )
				{
					if( $initObj[$paramStr] instanceof Object )
					{
						Utils.setParams( $target[$paramStr] , $initObj[$paramStr] ) ;
					}
					else
					{
						$target[$paramStr] = $initObj[$paramStr] ;
					}
				}
			}
		}
	}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Utils.Event = {} ;

	Utils.Event.add = function( $target , $type , $func )
	{
		try
		{
			$target.addEventListener( $type , $func , false ) ;
		}
		catch( $error )
		{
			$target.attachEvent( "on"+$type , $func ) ;
		}
	}

	Utils.Event.remove = function( $target , $type , $func )
	{
		try
		{
			$target.removeEventListener( $type , $func , false ) ;
		}
		catch( $error )
		{
			$target.detachEvent( "on"+$type , $func ) ;
		}
	}

//------------------------------------------------------------------------------------------------------------------------------






//------------------------------------------------------------------------------------------------------------------------------

	EnterFrame = {} ;

	EnterFrame.funcList = [] ;

	EnterFrame.add = function( $func )
	{
		EnterFrame.funcList[ EnterFrame.funcList.length ] = $func ;
	}

	EnterFrame.remove = function( $func )
	{
		Utils.Array.out( EnterFrame.funcList , $func ) ;
	}

	//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

	EnterFrame.update = function( )
	{
		var $i ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		for( $i in EnterFrame.funcList )		EnterFrame.funcList[ $i ]( ) ;
	}

	//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

	EnterFrame.FPS = 1000/60 ;

	EnterFrame.ID = setInterval( EnterFrame.update , EnterFrame.FPS ) ;

//------------------------------------------------------------------------------------------------------------------------------






//------------------------------------------------------------------------------------------------------------------------------

	Tween = function( $target , $tweenObj , $evtObj , $id )
	{
		var $this = this ;
		Tween.running[ Tween.running.length ] = $this ;

		$this.id = $id ;
		$this.target = $target ;

		$this.startTime = Tween.currentTime ;
		$this.time = $tweenObj.time * 1000 ;
		$this.transition = Tween.ease[ $tweenObj.transition ] ;
		if( $tweenObj.delay ) $this.startTime += $tweenObj.delay * 1000 ;

		$this.evtObj = $evtObj ;

		$this.tweens = [] ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		var $paramName ;
		var $def ;
		var $value ;
		var $unit ;

		for( $paramName in $tweenObj )
		{
			if( !$paramName.match( Tween.PARAMS_REG ) && $target[$paramName] != undefined )
			{
				$def = Number( String( $this.target[$paramName] ).replace( Tween.UNIT_REG , "" ) ) ;
				$value = Number( String( $tweenObj[$paramName] ).replace( Tween.UNIT_REG , "" ) ) ;
				$unit = String( $tweenObj[$paramName] ).replace( Tween.NUM_REG , "" ) ;

				$this.tweens[ $this.tweens.length ] = [ $paramName , $def , $value-$def , $unit ] ;
			}
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.update = function( )
		{
			var $updateTime = Tween.currentTime - $this.startTime ;

			if( $updateTime < 0 )				return ;
			if( $updateTime > $this.time )		$updateTime = $this.time ;

			//       -       -       -       -       -       -       -       -       -
			// tweens
			// [ name , defaultValue , changeValue , unit ]

			var $i ;
			var $tw ;
			var $name ;
			var $def ;
			var $value ;
			var $unit ;

			for( $i in $this.tweens )
			{
				$tw = $this.tweens[$i] ;

				$name = $tw[0] ;
				$def = $tw[1] ;
				$value = $tw[2] ;
				$unit = $tw[3] ;

				$target[ $name ] = $this.transition( null , $updateTime , $def , $value , $this.time ) ;

				if( $unit != "" )	$target[ $name ] = $target[ $name ] + $unit ;
			}

			//       -       -       -       -       -       -       -       -       -

			if( $this.evtObj )
			{
				if( $this.evtObj.onStart )
				{
					$this.evtObj.onStart( ) ;
					$this.evtObj.onStart = null ;
				}

				if( $this.evtObj.onUpdate )
				{
					$this.evtObj.onUpdate( ) ;
				}

				if( $updateTime == $this.time && $this.evtObj.onComplete )
				{
					$this.evtObj.onComplete( ) ;
				}
			}

			//       -       -       -       -       -       -       -       -       -

			if( $updateTime == $this.time )	$this.destroy( ) ;
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.destroy = function( )
		{
			Utils.Array.out( Tween.running , $this ) ;
		}
	}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Tween.NUM_REG = new RegExp( "[0-9.-]\d*" , "g" ) ;
	Tween.UNIT_REG = new RegExp( "px|%" , "gi" ) ;
	Tween.PARAMS_REG = new RegExp( "time|transition|delay" , "gi" ) ;

	Tween.FPS = 1000 / 45 ;

	Tween.add = function( $target , $tweenObj , $evtObj , $id )
	{
		new Tween( $target , $tweenObj , $evtObj , $id ) ;
	}

	Tween.startTime = ( new Date( ) ).getTime( ) ;
	Tween.currentTime = 0 ;
	Tween.running = [] ;

	Tween.remove = function( $target )
	{
		Utils.Array.outByParam( Tween.running , "target" , $target ) ;
	}
	Tween.removeById = function( $id )
	{
		Utils.Array.outByParam( Tween.running , "id" , $id ) ;
	}

	Tween.update = function( )
	{
		Tween.currentTime = ( new Date( ) ).getTime( ) - Tween.startTime ;

		var $i ;
		for( $i in Tween.running )	Tween.running[$i].update( ) ;
	}

//------------------------------------------------------------------------------------------------------------------------------

	Call = function( $callObj , $evtObj , $id )
	{
		var $this = this ;
		Tween.running[ Tween.running.length ] = $this ;

		$this.id = $id ;
		$this.target = null ;

		$this.startTime = Tween.currentTime ;
		$this.time = $callObj.time * 1000 ;
		$this.count = $callObj.count == undefined ? 1 : $callObj.count ;
		if( $callObj.delay ) $this.startTime += $callObj.delay * 1000 ;

		$this.evtObj = $evtObj ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.update = function( )
		{
			var $updateTime = Tween.currentTime - $this.startTime ;

			if( $updateTime < $this.time )			return ;

			//       -       -       -       -       -       -       -       -       -

			if( $this.evtObj )
			{
				if( $this.evtObj.onStart )
				{
					$this.evtObj.onStart( ) ;
					$this.evtObj.onStart = null ;
				}

				if( $this.evtObj.onUpdate )
				{
					$this.evtObj.onUpdate( ) ;
				}
			}

			$this.startTime += $this.time ;
			$this.count -- ;

			if( $this.count == 0 )
			{
				if( $this.evtObj.onComplete )	$this.evtObj.onComplete( ) ;

				$this.destroy( ) ;
			}
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.destroy = function( )
		{
			Utils.Array.out( Tween.running , $this ) ;
		}
	}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Call.add = function( $callObj , $evtObj , $id )
	{
		new Call( $callObj , $evtObj , $id ) ;
	}

	Call.removeById = Tween.removeById ;

//------------------------------------------------------------------------------------------------------------------------------

	/*
	 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
	 *
	 * Uses the built in easing capabilities added In jQuery 1.1
	 * to offer multiple easing options
	 *
	 * TERMS OF USE - jQuery Easing
	 *
	 * Open source under the BSD License.
	 *
	 * Copyright (c) 2008 George McGinley Smith
	 * All rights reserved.
	*/

	/*
	 * TERMS OF USE - EASING EQUATIONS
	 *
	 * Open source under the BSD License.
	 *
	 * Copyright (c) 2001 Robert Penner
	 * All rights reserved.
	 */

	Tween.ease =
	{
		linear:function(x, t, b, c, d) {
			return c*(t/d) + b;
		},

		easeInQuad: function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInCubic: function (x, t, b, c, d) {
			return c*(t/=d)*t*t + b;
		},
		easeOutCubic: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},
		easeInQuart: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		},
		easeOutQuart: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		easeInQuint: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeInSine: function (x, t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOutSine: function (x, t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOutSine: function (x, t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},
		easeInExpo: function (x, t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function (x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOutCirc: function (x, t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOutCirc: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},
		easeInElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},
		easeInOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		},
		easeInBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		easeInBounce: function (x, t, b, c, d) {
			return c - Tween.ease.easeOutBounce(x, d-t, 0, c, d) + b;
		},
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOutBounce: function (x, t, b, c, d) {
			if (t < d/2) return Tween.ease.easeInBounce(x, t*2, 0, c, d) * .5 + b;
			return Tween.ease.easeOutBounce(x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	}

//------------------------------------------------------------------------------------------------------------------------------






//------------------------------------------------------------------------------------------------------------------------------

	PrismaticTriangle = function( $points , $x , $y , $z , $rotateX , $rotateY , $rotateZ , $colorName , $moveXY , $autoRotation )
	{
		var $this = this ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.triangle = new Triangle( $points , $x , $y , $z , $rotateX , $rotateY , $rotateZ ) ;

		$this.colorName = $colorName == undefined ? "orange" : $colorName ;
		$this.color = new Color( Color.preset[ $colorName ] ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.waveX = new Wave( 20 + Math.random() * 10 ) ;
		$this.waveY = new Wave( 20 + Math.random() * 10 ) ;
		$this.waveZ = new Wave( 0 ) ;
		$this.waveRotateX = new Wave( 5 , 0.01 * Math.random( ) ) ;
		$this.waveRotateY = new Wave( 10 , 0.02 * Math.random( ) ) ;
		$this.waveRotateZ = new Wave( 5 , 0.01 * Math.random( ) ) ;

		$this.waveOn = function( $x , $y , $z , $rX , $rY , $rZ )
		{
			$x ? $this.waveX.on( ) : $this.waveX.off( ) ;
			$y ? $this.waveY.on( ) : $this.waveY.off( ) ;
			$z ? $this.waveZ.on( ) : $this.waveZ.off( ) ;

			$rX ? $this.waveRotateX.on( ) : $this.waveRotateX.off( ) ;
			$rY ? $this.waveRotateY.on( ) : $this.waveRotateY.off( ) ;
			$rZ ? $this.waveRotateZ.on( ) : $this.waveRotateZ.off( ) ;
		}
		$moveXY ? $this.waveOn( 1,1,1,1,1,1 ) : $this.waveOn( 0,0,0,1,1,1 ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.getPointBy2D = function( $index )
		{
			var $pt = $this.triangle.getPointBy2D( $index , $this.waveX.value , $this.waveY.value , $this.waveZ.value ,　
															$this.waveRotateX.value , $this.waveRotateY.value , $this.waveRotateZ.value ) ;
			return $pt ;
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.colorChange = function( $colorName )
		{
			$this.colorName = $colorName ;

			$this.color.colorChange( Color.preset[ $this.colorName ] ) ;
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.bright = function( )
		{
			Tween.add( $this.color , { brightness:255 , time:0.05 , transition:"linear" } ,
				{ onComplete:function(){ Tween.add( $this.color , { brightness:0 , time:0.4 , transition:"linear" , delay:0 } ) ; } } ) ;

			Call.add( { time:5+20*Math.random() } , { onComplete:$this.bright } ) ;
		}
		Call.add( { time:20*Math.random() } , { onComplete:$this.bright } ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.rotation = function( )
		{
			Tween.add( $this.triangle , { rotateY:Math.random()>0.5?$this.triangle.rotateY+360:$this.triangle.rotateY-360 , time:1.5 , transition:"easeInOutQuart" } ) ;

			Call.add( { time:3+10*Math.random() } , { onComplete:$this.rotation } ) ;
		}
		if( $autoRotation ) 	Call.add( { time:3+10*Math.random() } , { onComplete:$this.rotation } ) ;

	} ;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	PrismaticTriangle.switchColor = function( $triangle1 , $triangle2 )
	{
		if( $triangle1 == $triangle2 )	return ;

		var $color1 = $triangle1.colorName ;
		var $color2 = $triangle2.colorName ;

		$triangle1.colorChange( $color2 ) ;
		$triangle2.colorChange( $color1 ) ;
	}

//------------------------------------------------------------------------------------------------------------------------------

	Wave = function( $radius , $speed , $radian )
	{
		var $this = this ;

		$this.value = 0 ;
		$this.radius = $radius == undefined ? 20 + Math.random() * 10 : $radius ;
		$this.speed = $speed == undefined ? 0.01 * Math.random( ) : $speed ;
		$this.radian = $radian == undefined ? 0 + Math.random() * 3 : $radian ;

		$this.onEnterFrame = function( )
		{
			$this.radian += $this.speed ;

			$this.value = $this.radius * Math.cos( $this.radian ) ;
		}

		$this.on = function( )
		{
			EnterFrame.add( $this.onEnterFrame ) ;
		}
		$this.off = function( )
		{
			EnterFrame.remove( $this.onEnterFrame ) ;
		}
	}

//------------------------------------------------------------------------------------------------------------------------------

	Color = function( $rgb )
	{
		var $this = this ;

		$this.r = $rgb[0] == undefined ? 0 : $rgb[0] ;
		$this.g = $rgb[1] == undefined ? 0 : $rgb[1] ;
		$this.b = $rgb[2] == undefined ? 0 : $rgb[2] ;

		$this.brightness = 0 ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.getColor = function( )
		{
			return "#" + Color.getFF( $this.r+$this.brightness ) + Color.getFF( $this.g+$this.brightness ) + Color.getFF( $this.b+$this.brightness ) ;
		}
		$this.getColorOffset = function( $offsetR , $offsetG , $offsetB )
		{
			return "#" + Color.getFF( $this.r+$this.brightness+$offsetR ) + Color.getFF( $this.g+$this.brightness+$offsetG ) + Color.getFF( $this.b+$this.brightness+$offsetB ) ;
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.colorChange = function( $rgb )
		{
			var $r = $rgb[0] ;
			var $g = $rgb[1] ;
			var $b = $rgb[2] ;

			Tween.add( $this , { r:$r , g:$g , b:$b , time:0.5 , transition:"linear" } ) ;
		}
	}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Color.FF = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"] ;
	Color.getFF = function( $num )
	{
		return Color.FF[ Math.max( Math.min( Math.floor( $num/16 ) , 15 ) , 0 ) ] + Color.FF[ Math.max( Math.min( Math.floor($num%16) , 15 ) , 0 ) ] ;
	}
	Color.getINT = function( $colorStr )
	{
		var $colorArr = [] ;

		$colorArr[ $colorArr.length ] = Color.FF.indexOf( $colorStr.charAt( 0 ) ) * 16 + Color.FF.indexOf( $colorStr.charAt( 1 ) ) ;
		$colorArr[ $colorArr.length ] = Color.FF.indexOf( $colorStr.charAt( 2 ) ) * 16 + Color.FF.indexOf( $colorStr.charAt( 3 ) ) ;
		$colorArr[ $colorArr.length ] = Color.FF.indexOf( $colorStr.charAt( 4 ) ) * 16 + Color.FF.indexOf( $colorStr.charAt( 5 ) ) ;

		return $colorArr ;
	}

	Color.preset = {} ;
	Color.preset.red = Color.getINT( "FF6699" ) ;
	Color.preset.blue = Color.getINT( "3333FF	" ) ;
	Color.preset.green = Color.getINT( "FFFFFF" ) ;
	Color.preset.yellow = Color.getINT( "FCFF00" ) ;
	Color.preset.orange = Color.getINT( "FFE100" ) ;
	Color.preset.list = [ Color.preset.orange , Color.preset.blue , Color.preset.yellow , Color.preset.red , Color.preset.green ] ;

//------------------------------------------------------------------------------------------------------------------------------

	Triangle = function( $points , $x , $y , $z , $rotateX , $rotateY , $rotateZ )
	{
		var $this = this ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.reset = function( $points , $x , $y , $z , $rotateX , $rotateY , $rotateZ )
		{
			$this.points3D = [ 	new Point3D( $points[0] , $points[1] ) ,
								new Point3D( $points[2] , $points[3] ) ,
								new Point3D( $points[4] , $points[5] ) ] ;

			$this.x = $x == undefined ? 0 : $x ;
			$this.y = $y == undefined ? 0 : $y ;
			$this.z = $z == undefined ? 0 : $z ;

			$this.rotateX = $rotateX == undefined ? 0 : $rotateX ;
			$this.rotateY = $rotateY == undefined ? 0 : $rotateY ;
			$this.rotateZ = $rotateZ == undefined ? 0 : $rotateZ ;
		}

		$this.reset( $points , $x , $y , $z , $rotateX , $rotateY , $rotateZ ) ;

		$this.lensScale = 0.001 ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.getPointBy2D = function( $index , $offsetX , $offsetY , $offsetZ , $offsetRotateX , $offsetRotateY , $offsetRotateZ )
		{
			$offsetRotateX = $offsetRotateX == undefined ? 0 : $offsetRotateX ;
			$offsetRotateY = $offsetRotateY == undefined ? 0 : $offsetRotateY ;
			$offsetRotateZ = $offsetRotateZ == undefined ? 0 : $offsetRotateZ ;

			$offsetX = $offsetX == undefined ? 0 : $offsetX ;
			$offsetY = $offsetY == undefined ? 0 : $offsetY ;
			$offsetZ = $offsetZ == undefined ? 0 : $offsetZ ;

			//   -       -       -       -       -       -       -       -       -

			var $point3D = $this.points3D[ $index ].in( $this , $offsetRotateX , $offsetRotateY , $offsetRotateZ ) ;

			$point3D.z += $this.z + $offsetZ ;

			var $point = new Point( ) ;
			$point.x = $point3D.x * ( 1 - ( ($point3D.z) * $this.lensScale ) ) ;
			$point.y = $point3D.y * ( 1 - ( ($point3D.z) * $this.lensScale ) ) ;

			$point.x += $this.x + $offsetX ;
			$point.y += $this.y + $offsetY ;

			$point.x = ( $point.x + 0.5 ) | 0 ;
			$point.y = ( $point.y + 0.5 ) | 0 ;

			return $point ;
		}
	} ;

//------------------------------------------------------------------------------------------------------------------------------

	Point = function( $x , $y )
	{
		var $this = this ;

		$this.x = $x == undefined ? 0 : $x ;
		$this.y = $y == undefined ? 0 : $y ;
	}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Point3D = function( $x , $y , $z )
	{
		var $this = this ;

		$this.x = $x == undefined ? 0 : $x ;
		$this.y = $y == undefined ? 0 : $y ;
		$this.z = $z == undefined ? 0 : $z ;

		$this.in = function( $parent , $offsetRotateX , $offsetRotateY , $offsetRotateZ )
		{
			$offsetRotateX = $offsetRotateX == undefined ? 0 : $offsetRotateX ;
			$offsetRotateY = $offsetRotateY == undefined ? 0 : $offsetRotateY ;
			$offsetRotateZ = $offsetRotateZ == undefined ? 0 : $offsetRotateZ ;

			//   -       -       -       -       -       -       -       -       -

			var $pt = new Point3D( $this.x , $this.y , $this.z ) ;

			var $deg ;
			var $dist ;
			var $x = $pt.x ;
			var $y = $pt.y ;
			var $z = $pt.z ;

			$deg = Math.atan2( $pt.z , $pt.x ) / Math.PI * 180 ;
			$dist = Math.sqrt( $pt.z*$pt.z + $pt.x*$pt.x ) ;
			$deg -= $parent.rotateY + $offsetRotateY ;
			$pt.z = $dist * Math.sin( ($deg)/180*Math.PI ) ;
			$pt.x = $dist * Math.cos( ($deg)/180*Math.PI ) ;

			$deg = Math.atan2( $pt.y , $pt.z ) / Math.PI * 180 ;
			$dist = Math.sqrt( $pt.y*$pt.y + $pt.z*$pt.z ) ;
			$deg -= $parent.rotateX + $offsetRotateX ;
			$pt.y = $dist * Math.sin( ($deg)/180*Math.PI ) ;
			$pt.z = $dist * Math.cos( ($deg)/180*Math.PI ) ;

			$deg = Math.atan2( $pt.x , $pt.y ) / Math.PI * 180 ;
			$dist = Math.sqrt( $pt.x*$pt.x + $pt.y*$pt.y ) ;
			$deg -= $parent.rotateZ + $offsetRotateZ ;
			$pt.x = $dist * Math.sin( ($deg)/180*Math.PI ) ;
			$pt.y = $dist * Math.cos( ($deg)/180*Math.PI ) ;

			return $pt ;
		}
	}

//------------------------------------------------------------------------------------------------------------------------------





//------------------------------------------------------------------------------------------------------------------------------

	PrismCanvas = function( )
	{
		var $this = this ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.canvas = document.createElement( "canvas" ) ;
		$this.canvas.width = 500 ;
		$this.canvas.height = 670 ;

		$this.context = $this.canvas.getContext( "2d" ) ;
		$this.context.lineWidth = 0 ;
		$this.context.globalCompositeOperation = "darker" ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.triangles = [ ] ;
		$this.checkList = [ ] ;

		$this.add = function( $points , $x , $y , $z , $rotateX , $rotateY , $rotateZ , $colorName , $moveXY , $autoRotation , $checkIndex )
		{
			$this.checkList[ $this.checkList.length ] = $checkIndex ;

			$this.triangles[ $this.triangles.length ] = new PrismaticTriangle( $points ,
																			   $x , $y , $z ,
																			   $rotateX , $rotateY , $rotateZ ,
																			   $colorName , $moveXY , $autoRotation ) ;
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.colorChange = function( )
		{
			var $indexA = ( Math.random()*$this.triangles.length ) | 0 ;
			var $triangleA = $this.triangles[ $indexA ] ;
			var $checkA = $this.checkList[ $indexA ] ;
			var $colorA = $triangleA.colorName ;
			var $enabledList = [] ;

			for( var $indexB in $this.triangles )
			{
				var $triangleB = $this.triangles[ $indexB ] ;
				var $checkB = $this.checkList[ $indexB ]
				var $colorB = $triangleB.colorName ;;
				var $enabled = true ;

				for( var $i in $checkB )	if( $colorA == $this.triangles[ $checkB[$i] ].colorName )	$enabled = false ;

				if( $enabled )
				{
					for( $i in $checkA )	if( $colorB == $this.triangles[ $checkA[$i] ].colorName )	$enabled = false ;
				}

				if( $enabled )				$enabledList[ $enabledList.length ] = $triangleB ;
			}


			if( !$enabledList.length )		$enabledList = $this.triangles ;


			$triangleB = $enabledList[ ( Math.random()*$enabledList.length ) | 0 ] ;


			PrismaticTriangle.switchColor( $triangleA , $triangleB ) ;

			Call.add( { time:1+Math.random()*3 } , { onComplete:$this.colorChange } ) ;
		}
		Call.add( { time:4+Math.random()*3 } , { onComplete:$this.colorChange } ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.drawTriangle = function( $context , $tri )
		{
			var $pt1 ;
			var $pt2 ;
			var $pt3 ;

			$pt1 = $tri.getPointBy2D( 0 ) ;
			$pt2 = $tri.getPointBy2D( 1 ) ;
			$pt3 = $tri.getPointBy2D( 2 ) ;

			$context.beginPath( ) ;
			$context.moveTo($pt1.x,$pt1.y);
			$context.lineTo($pt2.x,$pt2.y);
			$context.lineTo($pt3.x,$pt3.y);
			$context.lineTo($pt1.x,$pt1.y);
			$context.closePath( ) ;

			$context.fillStyle = $tri.color.getColor( ) ;

			$context.fill() ;
		}

		$this.onEnterFrame = function( )
		{
			$this.context.clearRect( 0 , 0 , $this.canvas.width , $this.canvas.height ) ;
			for( var $i in $this.triangles ) 	$this.drawTriangle( $this.context , $this.triangles[$i] ) ;
		}

		EnterFrame.add( $this.onEnterFrame ) ;

	}

//------------------------------------------------------------------------------------------------------------------------------

	Prism = function( $divName )
	{
		EnterFrame.add( Tween.update ) ;

		var $this = this ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		var $canvas_L = new PrismCanvas( ) ;

		$canvas_L.add( [ 0,-50 , 45,30 , -45,30 ] , 65  , 92  , -350  , 0   , 0   , 48  , "blue"   , false , true  , [1,4] ) ;
		$canvas_L.add( [ 0,-85 , 40,30 , -40,30 ] , 127 , 8   , -1400 , 0   , 40  , 142 , "red"    , true  , false , [0,2,4] ) ;
		$canvas_L.add( [ 0,-80 , 40,30 , -40,30 ] , 286 , 120 , -1900 , 55  , -47 , 8   , "green"  , false , false , [1,3] ) ;
		$canvas_L.add( [ 0,-50 , 40,30 , -40,30 ] , 387 , 62  , -150  , 25  , 0   , 14  , "orange" , true  , true  , [2] ) ;

		$canvas_L.add( [ 0,-70 , 40,30 , -40,30 ] , 88  , 205 , -1900 , 43  , -30 , 47  , "yellow" , true  , false , [0,1,5,6] ) ;
		$canvas_L.add( [ 0,-70 , 55,30 , -55,30 ] , 193 , 283 , -130  , -15 , -15 , -50 , "orange" , true  , true  , [2,4,6,7] ) ;

		$canvas_L.add( [ 0,-67 , 40,30 , -40,30 ] , 30  , 383 , -1700 , 34  , -57 , 29  , "red"    , true  , false , [4,7,8] ) ;
		$canvas_L.add( [ 0,-75 , 40,30 , -40,30 ] , 156 , 415 , -1600 , -21 , 54  , -44 , "green"  , false , false , [4,5,6,8,9] ) ;

		$canvas_L.add( [ 0,-50 , 45,30 , -45,30 ] , 65  , 496 , -370  , 15  , 0   , 38  , "blue"   , true  , true  , [6,7,9] ) ;
		$canvas_L.add( [ 0,-80 , 40,30 , -40,30 ] , 150 , 559 , -1500 , -24 , 47  , 47  , "yellow" , false , false , [7,8,10] ) ;
		$canvas_L.add( [ 0,-50 , 40,30 , -40,30 ] , 260 , 537 , -150  , 25  , 0   , -36 , "red"    , true  , true  , [9] ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		var $canvas_R = new PrismCanvas( ) ;

		$canvas_R.add( [ 0,-60 , 40,30 , -40,30 ] , 124 , 60  , -1450 , 65  , 4   , -22 , "yellow" , false , false , [1,2] ) ;
		$canvas_R.add( [ 0,-80 , 40,30 , -40,30 ] , 286 , 78  , -1700 , 58  , -47 , 17  , "red"    , true  , false , [0,2,3] ) ;

		$canvas_R.add( [ 0,-75 , 40,30 , -40,30 ] , 200 , 164 , -1180 , -16 , 54  , -49 , "green"  , false , false , [0,1,3,4] ) ;
		$canvas_R.add( [ 0,-50 , 40,30 , -40,30 ] , 340 , 150 , -600  , 25  , -8  , -20 , "blue"   , true  , true  , [1,2,4,5] ) ;

		$canvas_R.add( [ 0,-80 , 40,30 , -40,30 ] , 295 , 267 , -1150 , 13  , 22  , 134 , "yellow" , true  , false , [2,3,5,6,7] ) ;
		$canvas_R.add( [ 0,-85 , 40,30 , -40,30 ] , 488 , 258 , -1000 , 0   , 40  , -63 , "red"    , true  , false , [3,4,7] ) ;

		$canvas_R.add( [ 0,-70 , 55,30 , -55,30 ] , 347 , 415 , -134  , -20 , -5  , 21  , "orange" , false , true  , [4,6,7,8] ) ;
		$canvas_R.add( [ 0,-80 , 40,30 , -40,30 ] , 421 , 464 , -1900 , 62  , -44 , 13  , "green"  , false , false , [6,8,9] ) ;

		$canvas_R.add( [ 0,-80 , 40,30 , -40,30 ] , 224 , 540 , -930  , -32 , 49  , 48  , "yellow" , true  , false , [6,9] ) ;
		$canvas_R.add( [ 0,-78 , 40,30 , -40,30 ] , 342 , 567 , -1120 , -16 , -52 , -50 , "red"    , false , false , [8,7] ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		var $container = document.getElementById( $divName ) ;
		$container.style.position = "absolute" ;
		$container.style.overflow = "hidden" ;
		$container.style.width = "100%" ;
		$container.style.height = "670px" ;
		$container.appendChild( $canvas_L.canvas ) ;
		$container.appendChild( $canvas_R.canvas ) ;

		with( $canvas_L.canvas.style )
		{
			position = "absolute" ;
			opacity = 0 ;
			left = "0px" ;
		}

		with( $canvas_R.canvas.style )
		{
			position = "absolute" ;
			opacity = 0 ;
			right = "0px" ;
		}

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.onResize = function( )
		{
			if( window.innerWidth > 1200 )
			{
				$canvas_L.canvas.style.left = "0px" ;
				$canvas_R.canvas.style.right = "0px" ;
			}
			else
			{
				var $offset = ( window.innerWidth - 1200 ) / 2 ;
				$canvas_L.canvas.style.left = $offset + "px" ;
				$canvas_R.canvas.style.right = $offset + "px" ;
			}
		}

		Utils.Event.add( window , "resize" , $this.onResize ) ;
		$this.onResize( ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		Tween.add( $canvas_L.canvas.style , { opacity:1 , time:1 , transition:"linear" , delay:0.2 } ) ;
		Tween.add( $canvas_R.canvas.style , { opacity:1 , time:1 , transition:"linear" , delay:0.2 } ) ;

		//   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

		$this.resetpos = function( $LR , $index , $pts , $x , $y , $z , $rotateX , $torateY , $rotateZ )
		{
			var $arr = $LR=="L" ? $triangles_L : $triangles_R ;

			$arr[$index].triangle.reset( $pts , $x , $y , $z , $rotateX , $torateY , $rotateZ ) ;
		}

	} ;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	new Prism( "prism-container" ) ;

//------------------------------------------------------------------------------------------------------------------------------
