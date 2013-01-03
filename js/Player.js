Game.Player = new Class({
    initialize: function(spline){
        this.mesh = new THREE.Object3D();
        this.meshGround = null;
        this.meshBody = null;
        this.arcLengthPos = 0.0;
        this.msPerFrame = 0.0;
        this.direction = 0;
        this.splineRef = spline;
        this.splineLength = 0.0;
        this.splineGeometry = null;
        this.splineSegments = 0;
        this.material = null;
        this.scale = 0.8;
        this.initMaterials();
        this.pos = new THREE.Vector3();
    },
    
    buildMeshGrounding: function(){
        this.splineSegmentsRadius = this.splineGeometry.segmentsRadius; // shape of the segments
        this.splineRadius = this.splineGeometry.radius;                 // fatness of the spline
        
        this.meshGround = new THREE.Mesh(
            new THREE.CylinderGeometry( this.scale * this.splineRadius/*radiusTop*/, this.scale * this.splineRadius/*radiusBottom*/, 0.1/*height*/, this.splineSegmentsRadius/*segmentsRadius*/, 100/*segmentsHeight*/, false/*openEnded*/ ),
            this.material);
//        this.meshGround = new THREE.Mesh(
//            new THREE.SphereGeometry( this.splineRadius * 0.66/*radius*/, 30/*segwidth*/, 30/*segheight*/ ),
//            this.material);
            
        this.meshGround.rotation.x = 1.5*Math.PI;
        this.meshGround.rotation.z = Math.PI/2;
    },
    
    buildMeshBody: function(){
          
    },
    
     moveDirection: function(dir){
          var d = this.direction + dir;
          if(d < 0) d += this.splineSegmentsRadius;
          else if(d > this.splineSegmentsRadius - 1) d -= this.splineSegmentsRadius;
          this.direction = d;
    },
    
    handleSingleTick: function(){
        this.msPerFrame += 0.0000001;
        this.arcLengthPos += this.msPerFrame;
        if(this.arcLengthPos >= 1.0){
            this.arcLengthPos -= 1;
        }
        this.pos = this.splineGeometry.path.getPointAt(this.arcLengthPos);
    },
    
    alignPlayer: function(){
        // rot = normale, blau = tangente, gruen = binormale
        var geom = this.splineGeometry;
        var i = Math.floor(this.arcLengthPos*geom.segments);
        //var dir = geom.normals[i];
        
        // THIS WORKS =========
//        if(! geom.faces[i*this.splineSegmentsRadius + this.direction]){
//            console.log("Error at "+ i + " " + this.arcLengthPos + " (" + (i*this.splineSegmentsRadius + this.direction));   
//        }
//        var dir = geom.faces[i*this.splineSegmentsRadius + this.direction].normal;
//        var offPos = this.pos.clone().addSelf(dir.normalize().multiplyScalar(1.5*geom.radius));
//        this.mesh.position.set(offPos.x, offPos.y, offPos.z);
        // END WORKS ==========
        
        // binormal and normal make a plane (=> tangent is the normal of the plane)
        var tangent = geom.tangents[i], normal = geom.normals[i], binormal = geom.binormals[i];
        var dir = Game.Utils.getVectorByDir(binormal, normal, this.direction, this.splineSegmentsRadius);
        var offPos = this.pos.clone().addSelf(dir.normalize().multiplyScalar(1.75*(this.scale+0.1)*geom.radius));
        this.mesh.position.set(offPos.x, offPos.y, offPos.z);
        
        // rotation
        //var tangent = geom.tangents[i], normal = geom.normals[i], binormal = geom.binormals[i];
        var first = tangent, second = normal, third = binormal;
        var m = new THREE.Matrix4(first.x, second.x, third.x, 0,
                                    first.y, second.y, third.y, 0,
                                    first.z, second.z, third.z);
        this.mesh.rotation.getRotationFromMatrix(m);
    },
    
    initMaterials: function(){
        //this.material = new THREE.MeshPhongMaterial({color: 0xcccccc, opacity: 0.8, wireframe: false, transparent: true});
        //this.material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50, opacity:1 , shading: THREE.FlatShading  } );
        this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
    },
    
    
    initNextLevel: function(spline){
        this.resetLevel(spline);
        
        // build new ground mesh
        this.buildMeshGrounding();
        this.mesh.add(this.meshGround);
        representation.scene.add(this.mesh);
    },
    
    resetLevel: function(spline){
        this.splineRef = spline;
        this.splineGeometry = this.splineRef.children[0].geometry;
        this.splineSegments = this.splineGeometry.segments;
        this.splineLength = this.splineGeometry.path.getLength();
        
        // set new start position
        this.arcLengthPos = 0;
        
        // set speed per frame based on arclength
        var pathLength = this.splineLength;
        this.msPerFrame = 1.0/(2.0*pathLength);
    }
});



