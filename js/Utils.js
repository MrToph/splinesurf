Game.Utils = {};
Game.Utils.getVectorByDir = function(v1, v2, dir, segmentsRadius){
    var circleSplitAngle = 2*Math.PI/segmentsRadius;
    var angle = (Math.PI/2) - dir * circleSplitAngle;
    if(angle < 0) angle = 2*Math.PI + angle;
    var dir = v1.clone().multiplyScalar(Math.sin(angle)).addSelf(v2.clone().multiplyScalar(Math.cos(angle)));
    return dir;
};

Game.Utils.arrayShuffle = function(arr){
    var tmp, rand;
    for(var i =0; i < arr.length; i++){
        rand = Number.random(0, arr.length-1);
        tmp = arr[i]; 
        arr[i] = arr[rand]; 
        arr[rand] =tmp;
  }
}