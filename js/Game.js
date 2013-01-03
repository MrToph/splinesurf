Game.Game = new Class({
    initialize: function(){
        this.score = 0;
        this.level = 0;
        this.curLevel = null;
        this.player = new Game.Player();
        // create camera
        var fov = 70.11;
        this.camera    = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.x = 50;
        this.camera.position.z = 100;
        this.camera.position.y = 20;
        this.camera.lookAt(new THREE.Vector3(0,0,0));
    },
    
    updateScore: function(frames){
        this.score += frames;
    },
    
    
    getCamera: function(){
          return this.camera;
    },
    
    handleCamera: function(){
        var geom = this.player.splineGeometry;
        var playerArcLength = this.player.arcLengthPos;
        var cameraArclength = playerArcLength - 30*this.player.msPerFrame;       // 1 seconds back
        if( cameraArclength < 0)  cameraArclength = 1 + cameraArclength;
        var cameraPos = geom.path.getPointAt( cameraArclength).clone().addSelf( geom.path.getPointAt( playerArcLength).clone().subSelf(this.player.mesh.position).multiplyScalar(-4) );
        this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        this.camera.lookAt(this.player.mesh.position);
        
        
    },
    
    resetLevel: function(){
        this.score = 0;
        this.createLevel(this.level);
        
        // update player mesh etc
        this.player.resetLevel(this.curLevel.spline);
    },
    
    initNextLevel: function(){
        this.score = 0;
        this.createLevel(++this.level);
        
        // update player mesh etc
        this.player.initNextLevel(this.curLevel.spline);
    },
    
    createLevel: function(lvl){
        this.removeLevel();
        
        switch(lvl){
            case 1:
                this.curLevel = new Game.Level1();
                break;
            case 2:
                this.curLevel = new Game.Level2();
                break;
            default:
                console.log(this.level + '   is lvl');
        }
        
        // add level to the scene
        representation.scene.add(this.curLevel.spline); 
    },
    
    removeLevel: function(){
        if(!this.curLevel) return;
        var blockables = this.curLevel.blockables;
        blockables.each(function(arr, index){
            arr.each(function(obj, index2){
                representation.scene.remove(obj);
            }, this);
        }, this);
        
        representation.scene.remove(this.curLevel.spline);
        
        this.curLevel.blockables = [];
        this.curLevel.spline = [];
        this.curLevel = [];
    }
});