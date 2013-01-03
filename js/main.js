// declare a bunch of variable we will need later
var container;
var representation, controller;

//variables for game loop
var timeAtLastFrame = new Date().getTime();
var idealTimePerFrame = 1000 / 30;              // 30 fps ideal
var leftover = 0.0;
var frames = 0;

// ## bootstrap functions
if ( ! Detector.webgl ){
	// test if webgl is supported
	Detector.addGetWebGLMessage();
}else{
	// initialiaze everything
	init();
	// make it move			
	animate();	
}

// ## Initialize everything
function init() {
	// create the container element
	container = document.createElement( 'div' );
	container.id = "3D";
	document.body.appendChild( container );

	// start game
    var model = new Game.Game();
    representation = new Game.Representation(model);
    controller = new Game.Controller(model);            // in this order, because controller needs to listen to representaitons events
    
    
    container.appendChild( representation.getRendererDOM() );
    // init the Stats and append it to the Dom - performance vuemeter
	stats	= new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom	= '0px';
	container.appendChild( stats.domElement );
    
    representation.endLevelAnim();
}
			

// ## Animate and Display the Scene
function animate() {                                                             /* idea from http://codeofrob.com/entries/a-javascript-game-loop-for-multiplayer-webgl.html */
    var timeAtThisFrame = new Date().getTime();
    var timeSinceLastDoLogic = (timeAtThisFrame - timeAtLastFrame) + leftover;
    var catchUpFrameCount = Math.floor(timeSinceLastDoLogic / idealTimePerFrame);

    controller.handleTicks(catchUpFrameCount);
    
	// render the 3D scene
	render();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
	// update the stats
	stats.update();
    
    // set new dates for next call
    leftover = timeSinceLastDoLogic - (catchUpFrameCount * idealTimePerFrame);
    timeAtLastFrame = timeAtThisFrame;
}


// ## Render the 3D Scene
function render() {
	// actually display the scene in the Dom element
	representation.render();
}
