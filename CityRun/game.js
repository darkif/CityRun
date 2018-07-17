
import './js/libs/weapp-adapter'
import './js/libs/symbol'



var THREE = require('./js/build/three.js');
var TWEEN = require('./js/build/Tween.js');
var GLTFLoader = require('./js/loaders/GLTFLoader.js');

var scene, camera, renderer;
var player ;
var playerVertices = [];
var playerCube;
var anim;
var mixer;
var loader = new THREE.GLTFLoader();

var car = [];
var carCube = [];
var carPos;

var treePos = new Array(-0.5, 2.6);
var treeCube = [];

var clock = new THREE.Clock();

var house = [];
var housePos = new Array(-4.5, 8);
var i = 0;

var jumping = true;

var coinPos = new Array(-1, 0, 4, 5);
var diamond = [];
var diamondCube = [];
var coin = [];
var coinCube = [];

var btn = false;

var beginPosX;
var endPosX;
var beginPosY;
var endPosY;

var tweenUp;
var tweenDown;

function init(){
  //init scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(-24, 20, 3.5);
  camera.lookAt(scene.position);

  var context = canvas.getContext('webgl');
  renderer = new THREE.WebGLRenderer(context);
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  //renderer.shadowMap.enabled = true;
  canvas.appendChild(renderer.domElement);

  //create light
  var light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
  light.position.set(-30, 20, 10);
  light.intensity = 1.5;
  scene.add(light);

  var light1 = new THREE.DirectionalLight(0xaaaaaa);
  light1.position.set(-30, 40, 20);
  //light1.intensity=2;
  /*light1.castShadow = true;
  light1.shadow.camera.top = 30;
  light1.shadow.camera.bottom = -15;
  light1.shadow.camera.left = 30;
  light1.shadow.camera.right = -20;
  light1.shadow.camera.near = 0;
  light1.shadow.camera.far = 100;*/
  scene.add(light1);

//creat player
  var geo = new THREE.BoxGeometry(0.25, 1, 0.25);
  var mat = new THREE.MeshBasicMaterial({ color: 0x0000ee });
  playerCube = new THREE.Mesh(geo, mat);
  playerVertices = playerCube.geometry.vertices;
  //playerCube.position.set(-13,2,2);
  //scene.add(playerCube);

//load player model
  loader.load('http://www.shinexr.com:89/rawassets/gltf/character/scene.gltf', function (gltf) {
    scene.add(gltf.scene);

    gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[3].castShadow = true;
    gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[3].receiveShadow = true;
    gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].castShadow = true;
    gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].receiveShadow = true;

    anim = gltf.animations;
    mixer = new THREE.AnimationMixer(gltf.scene);
    if (anim) {
      var animation = anim[2];
      mixer.clipAction(animation).play();
    }
    gltf.scene.name = 'player';
    gltf.scene.position.set(-5, 0, 1);
    gltf.scene.rotation.y -= 30;
    player = gltf.scene;
  });

  //load road
  loader.load('http://www.shinexr.com:89/rawassets/gltf/road/Unity2Skfb.gltf', function (gltf) {

    scene.add(gltf.scene);

    gltf.scene.children[0].children[0].receiveShadow = true;


    gltf.scene.scale.set(1.5, 1, 1);
    gltf.scene.position.set(40, 0, 1);

  });

  //生成车
  creatCar();
  //生成树、金币等
  creatObject();
  //生成房屋
  createHouse();

  //每帧更新
  animate();
}

  tweenUp = new TWEEN.Tween({ x: 0 });
  tweenUp.to({ x: 100 }, 6).easing(TWEEN.Easing.Sinusoidal.InOut);
  tweenUp.onUpdate(function () {
    var x = this.x;
    player.position.y = player.position.y + x;
    if (player.position.y >= 1.8) {
      player.position.y = 1.8;
    }
  });
  //跳跃往下掉平滑过渡
  tweenDown = new TWEEN.Tween({ x: 0 });
  tweenDown.to({ x: 100 }, 6).easing(TWEEN.Easing.Sinusoidal.InOut);
  tweenDown.onUpdate(function () {
    var x = this.x;
    player.position.y = player.position.y - x;
    if (player.position.y <= 0) {
      player.position.y = 0;
    }
    //console.log( player.position.y);
  });

canvas.addEventListener('touchstart', ((e) => {
  e.preventDefault()
  beginPosX = e.touches[0].pageX
  beginPosY = e.touches[0].pageY
  //屏幕上半部分点击一下跳跃
  if ((beginPosY < innerHeight / 2) && jumping) {
    tweenUp.start();
    var index=getRandomInt(0,1);
    mixer.clipAction(anim[index]).play();
    //player.position.y += 1;
    jumping = false;

    beginPosY = innerHeight / 2;
    setTimeout(function () {
      //player.position.y -= 1;
      tweenDown.start();
      setTimeout(function () {
        mixer.clipAction(anim[index]).stop()
        jumping = true;
      }, 330)
    }, 450)
  }
}).bind(this))

canvas.addEventListener('touchmove', ((e) => {
  e.preventDefault()
  endPosX = e.touches[0].pageX
  endPosY = e.touches[0].pageY

  //手指按住左移
  if (beginPosX < endPosX) {
    if (player.position.z <= 4.5) {
      player.position.z += 0.1;
    }
    beginPosX = endPosX;
  }
  //按一下右移
  if (beginPosX > endPosX) {
    if (player.position.z >= -2.5) {
      player.position.z -= 0.1;
    }
    beginPosX = endPosX;
  }


}).bind(this))


function animate(){
  requestAnimationFrame(animate);


  TWEEN.update();

  //人物动画更新
  if (mixer) {
    mixer.update(clock.getDelta()*1000);
  }

  //运动
  for (var j in car) {
    car[j].position.x -= 0.25;
    carCube[j].position.x -= 0.25;
    
  }

  for (var k in house) {
    house[k].position.x -= 0.1;
  }

  for (var k in treeCube) {
    treeCube[k].position.x -= 0.1;
  }


  for (var k in coin) {
    coin[k].rotateY(0.1);
    if (coinCube[k]) {
      coinCube[k].position.x -= 0.1;
      coin[k].position.x -= 0.1;
    }

  }

 for (var k in diamond) {
    diamond[k].position.x -= 0.1;
    diamondCube[k].position.x -= 0.1;
 }

  collision(player, playerVertices, carCube,  function () {
   
    //scene.remove(player);
  });

  collision(player, playerVertices, treeCube, function () {
    
    scene.remove(player);
  });

  collision(player, playerVertices, coinCube, function () {

  });

  collision(player, playerVertices, diamondCube, function () {

  });

  renderer.render(scene, camera);
}



//随机生成car
function creatCar(){
  var c0,c0Cube;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/car/car.gltf', function (gltf) {
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    gltf.scene.rotation.y += Math.PI;
    //gltf.scene.children[0].children[0].castShadow = true;
    //gltf.scene.children[0].children[0].receiveShadow = true;
    c0=gltf.scene;

    c0Cube = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1.3), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true,       opacity: 0 }));
    });

  var c1,c1Cube;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/car1/Unity2Skfb.gltf', function (gltf) {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.rotation.y += Math.PI / 2;
    //gltf.scene.children[0].children[0].castShadow = true;
    //gltf.scene.children[0].children[0].receiveShadow = true;
    c1=gltf.scene;

    c1Cube = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1.3), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true,       opacity: 0 }));
    });

  var c2,c2Cube;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/car2/Unity2Skfb.gltf', function (gltf) {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.rotation.y += Math.PI / 2;
    //gltf.scene.children[0].children[0].castShadow = true;
    //gltf.scene.children[0].children[0].receiveShadow = true;
    c2=gltf.scene;

    c2Cube = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1.3), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true,       opacity: 0 }));
    });

  //随机生成car
  setInterval(function () {
    //var index = getRandomInt(0, 2);
    var index=2;
    carPos = getRandomInt(0, 5);

    if(0==index){
      var c=c0.clone();
      var cube=c0Cube.clone();
      if (carPos < 2) {
        carPos = -2;
      }
      else if (carPos < 4) {
        carPos = 1;
      }
      else {
        carPos = 4;
      }
      c.position.set(30, 0, carPos);
      cube.position.set(29.5, 0, c.position.z+0.1);
      car.push(c);
      carCube.push(cube);
      scene.add(c);
      scene.add(cube)
      setTimeout(function(){
        scene.remove(c);
        scene.remove(cube);
        car.splice(0, 1);
        carCube.splice(0, 1);
      },3500);
    }




    if (1 == index) {  
       var c=c1.clone();
       var cube=c1Cube.clone(); 
        if (carPos < 2) {
          carPos = 4;
        }
        else if (carPos < 4) {
          carPos = 7;
        }
        else {
          carPos = 10;
        }
      
        c.position.set(30, 0, carPos);
        car.push(c);
        scene.add(c);
       
        cube.position.set(24.5, 0, c.position.z - 5.9);
        carCube.push(cube);
        scene.add(cube);
        setTimeout(function(){
          scene.remove(c);
          scene.remove(cube);
          car.splice(0, 1);
          carCube.splice(0, 1);
        },3500);
    }

    if (2 == index) {
        var c=c2.clone();
        var cube=c2Cube.clone();
        if (carPos < 2) {
          carPos = -2.5;
        }
        else if (carPos < 4) {
          carPos = 1;
        }
        else {
          carPos = 4;
        }
        
        c.position.set(35, 0, carPos);
        car.push(c);
        scene.add(c);
        
        cube.position.set(28.5, 0,c.position.z + 0.4);
        carCube.push(cube);
        scene.add(cube);

        setTimeout(function () {
          scene.remove(c);
          scene.remove(cube);
          car.splice(0,1);
          carCube.splice(0,1);
        }, 3500);
    }

  }, 2000);
}

 //生成树 coin 
function creatObject(){
  var tree,tCube;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/tree//Unity2Skfb.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    tree=gltf.scene;

    tCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 0.8), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true,          opacity: 0 }));
  });
 
  var coinObj,cCube;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/coin/Unity2Skfb.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].children[0].castShadow = true;
    coinObj=gltf.scene;

    cCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true,          opacity: 0 }));
  });

  var diamondObj,dCube;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/Diamond/Unity2Skfb.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].children[0].castShadow = true;
    diamondObj=gltf.scene;

    dCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 1), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true,          opacity: 0 }));
  });

  setInterval(function () {
    var pos = getRandomInt(0, 3);
    //var pos=2;
    if (loader) {
      if (pos == 0 || pos == 3) {
          var t=tree.clone();
          var cube=tCube.clone();
          house.push(t);
          i = getRandomInt(0, 1);
          t.position.set(35, 0, treePos[i]);
          scene.add(t);

          cube.position.set(35, 0, t.position.z);
          scene.add(cube);
          treeCube.push(cube);

          setTimeout(function () {
            scene.remove(t);
            scene.remove(cube);
            treeCube.splice(0, 0);
          }, 9000);
      }
      if (pos == 1) {
          var c=coinObj.clone();
          var cube=cCube.clone();
         
          i = getRandomInt(0, 3);
          c.position.set(35, 0, coinPos[i]);
          coin.push(c);

          cube.position.set(35, 0, c.position.z);
          scene.add(cube);
          coinCube.push(cube);
          cube.children.push(c);

          setTimeout(function () {
            scene.remove(c);
            scene.remove(cube);
            coin.splice(0, 1);
            coinCube.splice(0,1);
          }, 10000);
      }


      if (pos == 2) {
        var d = diamondObj.clone();
        var cube = dCube.clone();
        i = getRandomInt(0, 3);
        d.position.set(35 + 4.5, 0, coinPos[i]);
        diamond.push(d);       
        scene.add(d);
         
        cube.position.set(35, 1.2, d.position.z-0.1);
        scene.add(cube);
        diamondCube.push(cube);
        cube.children.push(d);

        setTimeout(function () {
            scene.remove(d);
            scene.remove(cube);
            diamond.splice(0, 1);
            diamondCube.splice(0,1);
        }, 10000);

      }
    }
    
  }, 3000);
}

 //生成房屋
function createHouse(){
  var build0;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/Build/Unity2Skfb.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    build0=gltf.scene;
  });

  var build1;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/Build1/Unity2Skfb.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.25, 0.25, 0.25);
    build1=gltf.scene;
  });

  var build2;
  loader.load('http://www.shinexr.com:89/rawassets/gltf/Build2/build2.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    build2=gltf.scene;
  });

  //生成房屋
  setInterval(function () {
    var index = getRandomInt(0, 2);
    //var index=2;
    if(loader){
      if (index == 0) {
          var b=build0.clone();
          i = getRandomInt(0, 1);
       
            b.rotation.y = Math.PI;
            b.position.set(23.5, 1, -5.5 );
             
          scene.add(b);
          house.push(b);

          setTimeout(function () {
            scene.remove(b);
            house.splice(0, 1);
          }, 8000);
      }

      if (index == 1) {
          var b = build1.clone();
         
          i = getRandomInt(0, 1);
        
            b.rotation.y = Math.PI;
            b.position.set(32, 1, -7.5);

          scene.add(b);
          house.push(b);

          setTimeout(function () {
            scene.remove(b);
            house.splice(0, 1);
          }, 8000);
      }

      if (index == 2) {
          var b = build2.clone();
         
          i = getRandomInt(0, 1);
         
            b.rotation.y = Math.PI;
            b.position.set(33.5, 1, -5.5);

          scene.add(b);
          house.push(b);

          setTimeout(function () {
            scene.remove(b);
            house.splice(0, 1);
          }, 8000);
      }
    }
   
  }, 2000);
}


//检测palyer是否与object发生碰撞
function collision(player, playerVertices, object, action) {
  if (playerVertices) {
    if(player){
      var originPoint = player.position.clone();//获取物体中心点坐标
      for (var vertexIndex = 0; vertexIndex < playerVertices.length; ++vertexIndex) {
        //顶点原始坐标
        var localVertex = playerVertices[vertexIndex].clone();
        //顶点经过变换后的坐标
        var globalVertex = localVertex.applyMatrix4(player.matrix);
        //获得由中心指向定点的向量
        var directionVector = globalVertex.sub(player.position);
        //将方向向量初始化并发射光线
        var ray = new THREE.Raycaster(originPoint, directionVector.clone());
        //检测射线与多个物体的相交情况
        //如果为true，它还检查所有后代。否则只检测该对象本身，缺省值为false
          var collisionResults = ray.intersectObjects(object, true);
          if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            for (var i in collisionResults) {
              scene.remove(collisionResults[i].object);
              scene.remove(collisionResults[i].object.children[0]);
            }
            action();
          }
      }
    }
  }
}
    


//随机取整数[min-max]
function getRandomInt(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;

}


init()