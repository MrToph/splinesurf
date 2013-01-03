Game.Controller = new Class({
    initialize: function(model){
       // init Model
       this.model = model;
       this.running = false;
       this.left = false;
       this.right = false;
       this.moveTick = 0;
       this.moveLimit = 0;
       
       // representation is a global var
       representation.addEvent('endLevelAnimFinished', this.onEndLevelAnimFinished.bind(this));
       representation.addEvent('nextLevelAnimFinished', this.onNextLevelAnimFinished.bind(this));
       
       // handle keyboard
       this.keyboard = new Keyboard({
            defaultEventType: 'keydown',
            events: {
                'left': this.leftDown.bind(this),
                'right': this.rightDown.bind(this),
                'keyup:left': this.leftUp.bind(this),
                'keyup:right': this.rightUp.bind(this),
                'keyup:space': this.resetLevel.bind(this),
            }
        });
        this.keyboard.activate();
    },
    
    handleTicks: function(frames){
        if(frames <= 0) return;                     // no new frame => do nothing
        
        if(this.running){
            for(var i = 0; i < frames; i++){
                
                this.model.curLevel.handleSingleTick();
                this.model.player.handleSingleTick();
            }
            
            // set players mesh accordingly
            this.model.player.alignPlayer();    
            
            
            // set camera
            this.model.handleCamera();
            
            if(this.collisionDetect()){
                this.running = false;   
            }
            
            
            // check if we hit next level
            if(false){
                this.running = false;
                representation.endLevelAnim();    
            }
        }
    },
    
    leftDown: function(){
        this.left = true;
        this.model.player.moveDirection(+1);
    },
    
    rightDown: function(){
        this.right = true;
        this.model.player.moveDirection(-1);
    },
    
    leftUp: function(){
        this.left = false;
        this.moveTick = this.moveLimit - 1;
    },
    
    rightUp: function(){
        this.right = false;
        this.moveTick = this.moveLimit - 1;
    },
    
    collisionDetect: function(){
        var player = this.model.player;
        var dir = player.direction;
        var segments = player.splineSegments;
        var curSegment = Math.floor(player.arcLengthPos * segments);
        var hit = false;
        for(var i = curSegment-1, limit = curSegment+1; i <= limit; i++){
            var blockables = this.model.curLevel.blockables[i % segments];
            if(!blockables) continue;           // undefined or null
//            var intersects = player.mesh.intersectObjects(blockables);
//            if(intersects.length > 0){
//                return true;   
//            }
            //console.log(blockables);
            blockables.each(function(obj, index){
                if(index === dir){
                    hit = true;    
                }
            }, this);
        }
        return hit;
    },
    
    resetLevel: function(){
        console.log("RESTART!");
        this.running = false;
        this.model.resetLevel();
        this.running = true;
    },
    
    onEndLevelAnimFinished: function(){     // this points to representation
        var tmp = this.model.curLevel;
        if(tmp !== null){
           representation.scene.remove(tmp.spline); 
        }
        
        // init next level
        this.model.initNextLevel();
        tmp = this.model.curLevel.spline;
        
        console.log(tmp);
        console.log(tmp.children[0].geometry);
        
        representation.nextLevelAnim();
    },
    
    onNextLevelAnimFinished: function(){    // this points to representation
          this.running = true;
    }
});