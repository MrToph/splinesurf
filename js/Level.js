Game.Level = new Class({
    initialize: function(spline){
        this.blockables = [];
        this.powerups = [];
        this.spline = this.buildSpline();
        this.buildBlockables();
    },
    
    handleSingleTick: function(){
        
    },
    
    handleCamera: function(){
          
    },
    
    alignBlockables: function(dir){
          
    },
    
    buildSpline: function(){
          return null;
    },
    
    buildMeshFromGeometry: function(geometry, color){
        var tubeMesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
		    new THREE.MeshLambertMaterial({
						color: color,
						opacity: (geometry.debug) ? 0.2 : 0.5,
						transparent: true
					}),
		    new THREE.MeshBasicMaterial({
						color: color,
						opacity: 0.5,
						wireframe: true,
                        transparent: true
		    })
        ]);

		if (geometry.debug) tubeMesh.add(geometry.debug);  
        return tubeMesh;
    },
    
    buildBlockables: function(){
        //this.material = new THREE.MeshPhongMaterial({color: 0xff0000, opacity: 0.8, wireframe: false, transparent: true});
        this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.blockables = [];
        var geom = this.spline.children[0].geometry;
        var path = geom.path;
        var segments = geom.segments;
        var segmentsRadius = geom.segmentsRadius;
        var cylinderGeom = new THREE.CylinderGeometry( geom.radius/*radiusTop*/, geom.radius/*radiusBottom*/, 0.1/*height*/, segmentsRadius/*segmentsRadius*/, 1/*segmentsHeight*/, false/*openEnded*/ );
        var availablePositions = [];
        for(var j = 0; j < segmentsRadius; j++){
            availablePositions.push(j);    
        }
        
        for(var i = 0; i < segments; i++){
            var directions = availablePositions.clone();
            Game.Utils.arrayShuffle(directions);
            
            var rnd = Math.random();
            if(rnd < 0.0015){
                directions = directions.slice(0, -1);        // extract array from 0 to the second last (-1 = 1 counting from tail)  
            }
            else if(rnd < 0.005){
                directions = directions.slice(0, -2);
            }
            else if(rnd < 0.01){
                directions = directions.slice(0, -3);
            }
            else if(rnd < 0.02){
                directions = directions.slice(0, -4);
            }
            else if(rnd < 0.025){
                directions = directions.slice(0, -5);
            }
            else{
                directions = [];   
            }
            
            if(directions.length > 0){
                var objects = [];
                
                var arcLengthPos = i/segments;
                var pos = path.getPointAt(arcLengthPos);
                var tangent = geom.tangents[i], normal = geom.normals[i], binormal = geom.binormals[i];
                directions.each(function(dir, index){
                    var obj = new THREE.Object3D();
                    var mesh = new THREE.Mesh(cylinderGeom, this.material);
                    mesh.rotation.x = 1.5*Math.PI;
                    mesh.rotation.z = Math.PI/2;
                    obj.add(mesh);
                            
                    // move in dir on spline
                    var dirVector = Game.Utils.getVectorByDir(binormal, normal, dir, segmentsRadius);
                    var offPos = pos.clone().addSelf(dirVector.normalize().multiplyScalar(1.75*geom.radius));
                    obj.position.set(offPos.x, offPos.y, offPos.z);
                            
                    // rotate it correctly on spline
                    var m = new THREE.Matrix4(tangent.x, normal.x, binormal.x, 0,
                                                tangent.y, normal.y, binormal.y, 0,
                                                tangent.z, normal.z, binormal.z);
                    obj.rotation.getRotationFromMatrix(m);
                            
                    representation.scene.add(obj);
                    objects[dir] = (obj); 
                }, this);
                this.blockables[i] = objects;
            }
        }
    }
});

Game.Level1 = new Class({
    Extends: Game.Level,
    initialize: function(){
        this.parent();
    },
    
    buildSpline: function(){
        var extrudePath = new THREE.Curve();
        extrudePath.getPoint = function(t) {
        	var p = 2,
    			q = 5;
    		t *= Math.PI * 2;
    		var tx = (2 + Math.cos(q * t)) * Math.cos(p * t),
    			ty = (2 + Math.cos(q * t)) * Math.sin(p * t),
    			tz = Math.sin(q * t);
    
    		return new THREE.Vector3(tx, ty, tz).multiplyScalar(30.0/3);
    	}
       
	    var geometry = new THREE.TubeGeometry(extrudePath, 100/*segments*/, 1/*radius*/, 6/*radiusSegments*/, true/*closed2*/, false/*debug*/);
        return this.buildMeshFromGeometry(geometry, Math.random() * 0xffffff);
    }
});

Game.Level2 = new Class({
    Extends: Game.Level,
    initialize: function(){
        this.parent();
    },
    
    buildSpline: function(){
        this.extrudePath = new THREE.Curve();
        this.extrudePath.getPoint = function(t) {
            t *= 2 * Math.PI;
            var tx = 16 * Math.pow(Math.sin(t), 3);
        	var ty = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t), tz = 0;
        
        	return new THREE.Vector3(tx, ty, tz).multiplyScalar(50.0/16);
        
        }
       
	    var geometry = new THREE.TubeGeometry(this.extrudePath, 300/*segments*/, 1/*radius*/, 6/*radiusSegments*/, true/*closed2*/, false/*debug*/);
        return this.buildMeshFromGeometry(geometry, 0x0000ff);
    }
});





