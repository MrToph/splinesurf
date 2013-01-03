Game.Representation = new Class({
    Implements: Events,
    initialize: function(model){
        this.model = model;
        // init the WebGL renderer and append it to the Dom
        this.renderer = new THREE.CanvasRenderer({
    		antialias	: true
    	});
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    
        // create the Scene
    	this.scene = new THREE.Scene();
    	var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 1, 0, 1 ).normalize();
        this.scene.add( directionalLight );
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 0, 1, -1 ).normalize();
        this.scene.add( directionalLight );
        
        this.camera = this.model.getCamera();
        //add camera to scene
        this.scene.add(this.camera);
	
        WindowResize(this.renderer, this.camera);
        this.scene.fog = new THREE.Fog( 0x000000, 1, 40 );
        this.renderer.setClearColor( this.scene.fog.color, 1 );
    	//this.renderer.autoClear = false;							// no need
    },
    
    endLevelAnim: function(){
        this.fireEvent('endLevelAnimFinished');  
    },
    
    nextLevelAnim: function(){
        this.fireEvent('nextLevelAnimFinished');  
    },
    
    render: function(){
        this.renderer.render( this.scene, this.camera );
    },
    
    getRendererDOM: function(){
        return this.renderer.domElement;   
    }
});