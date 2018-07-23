
import './js/libs/weapp-adapter'
import './js/libs/symbol'
import GameInfo from './js/gameinfo'

var THREE = require('./js/three.js');
var TWEEN = require('./js/build/Tween.js');
var GLTFLoader = require('./js/loaders/GLTFLoader.js');
var gameInfo = new GameInfo();

let scorePng = new Image()
scorePng.src = 'images/score.png'

let coinPng = new Image()
coinPng.src = 'images/coin.png'

let diamondPng = new Image()
diamondPng.src = 'images/diamond.png'

var scene, camera, renderer,renderer2;
var player;
var playerVertices = [];
var playerCube;
var anim;
var mixer;
var loader = new THREE.GLTFLoader();

var road;

var car = [];
var carCube = [];
var carPos;
var c0, c0Cube, c1, c1Cube, c2, c2Cube

var treePos = new Array(-0.5, 2.6);
var tree=[];
var treeCube = [];
var treeObj, tCube, coinObj, cCube, diamondObj, dCube;

var clock = new THREE.Clock();

var house = [];
var housePos = new Array(-4.5, 8);
var build0, build1, build2;
var i = 0;

var jumping = true;

var coinPos = new Array(-1, 0, 4, 5);
var diamond = [];
var diamondCube = [];
var coin = [];
var coinCube = [];

var btn = true;

var beginPosX;
var endPosX;
var beginPosY;
var endPosY;

var tweenUp;
var tweenDown;

var gameOver=false;
var score=0;
var coinNum=0;
var diamondNum=0;

var sceneHUD;
var cameraHUD;
var hudBitmap;
var hudTexture;

var carId,objectId,houseId;
var starting=true;

wx.showShareMenu(true)


function init(){
  //init scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(-25, 20, 3.5);
  camera.lookAt(scene.position);
  

  var context = canvas.getContext('webgl');
  renderer = new THREE.WebGLRenderer(context);
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.shadowMap.enabled = true;
  
  canvas.appendChild(renderer.domElement);



  ready();
 
  //create light
  var light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
  light.position.set(-30, 20, 10);
  light.intensity = 1.5;
  scene.add(light);

  var light1 = new THREE.DirectionalLight(0xaaaaaa);
  light1.position.set(-30, 40, 20);
  //light1.intensity=2;
  light1.castShadow = true;
  light1.shadow.camera.top = 30;
  light1.shadow.camera.bottom = -15;
  light1.shadow.camera.left = 30;
  light1.shadow.camera.right = -20;
  light1.shadow.camera.near = 0;
  light1.shadow.camera.far = 100;
  scene.add(light1);


  //load road
  createRoad()
  //load player model
  createPlayer()

  //创建UI
  createHUD();

  //每帧更新
  animate();
}

function createHUD(){ //bitmap在小游戏中没有需要threejs修改才可使用
  var hudCanvas = wx.createCanvas();
  hudCanvas.width = innerWidth;
  hudCanvas.height = innerHeight;
  hudBitmap = hudCanvas.getContext('2d');
  hudBitmap.font = "bold 20px Arial"
  hudBitmap.textAlign = 'center';
  hudBitmap.fillStyle = "#ffffff"
  hudBitmap.fillText('Initializing', 80,50);


  //创建一个正交相机
  cameraHUD = new THREE.OrthographicCamera(
    -innerWidth / 2, innerWidth / 2,
    innerHeight / 2, -innerHeight / 2,
    0, 100
  );


  sceneHUD = new THREE.Scene();//创建新场景
  hudTexture = new THREE.Texture(hudCanvas);
  hudTexture.minFilter = THREE.LinearFilter;
  hudTexture.needsUpdate = true;
  var material = new THREE.MeshBasicMaterial({ map: hudTexture });
  material.transparent = true;
  var planeGeometry = new THREE.PlaneGeometry(innerWidth, innerHeight);
  var plane = new THREE.Mesh(planeGeometry, material);
  sceneHUD.add(plane);
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
}).bind(this))

canvas.addEventListener('touchmove', ((e) => {
  e.preventDefault()
  endPosX = e.touches[0].pageX
  endPosY = e.touches[0].pageY
  //手指按住左移
  if (beginPosX < endPosX  && btn) {
    if (player.position.z <= 4.5) {
      player.position.z += 0.1;
    }
    beginPosX = endPosX;
  }
  //按一下右移
  if (beginPosX > endPosX && btn) {
    if (player.position.z >= -2.5) {
      player.position.z -= 0.1;
    }
    beginPosX = endPosX;
  }

  //jump
  var index = getRandomInt(0, 1);
  if ((beginPosY-endPosY)>60 && Math.abs(beginPosX-endPosX)<0.1 && jumping && btn) {
    tweenUp.start();
    btn = false;
    jumping = false;
    mixer.clipAction(anim[index]).play();
    //player.position.y += 1;

    beginPosY = innerHeight / 2;
    setTimeout(function () {
      //player.position.y -= 1;
      tweenDown.start();
      setTimeout(function () {
        mixer.clipAction(anim[index]).stop()
        btn = true;
        jumping = true;
      }, 330)
    }, 450)
  }

}).bind(this))

// 游戏开始和结束的触摸事件处理逻辑
wx.onTouchStart(function (e) {
  let x = e.touches[0].clientX
  let y = e.touches[0].clientY
  if(starting){
    if (x > innerWidth / 2 -80 && x < innerWidth / 2 + 100 && y > innerHeight / 2 + 130 && y < innerHeight / 2 +180) {
      starting=false;
      if(!road){
        createRoad();
        createPlayer();
        ready();
      }
      //生成车
      createCar();
      //生成树、金币等
      createObject();
      //生成房屋
      createHouse();
    }
  }
  if(gameOver){
    if (x > innerWidth / 2 +40 && x < innerWidth / 2 + 70 && y > innerHeight / 2+120 && y < innerHeight / 2 + 160){
      reset();
      createPlayer();
      gameOver = false;
      score = 0;
      coinNum=0;
      diamondNum=0;
      temp=-1;
      createCar();
      createHouse();
      createObject();
      animate();
    }
    if (x > innerWidth / 2 - 70 && x < innerWidth / 2 -30 && y > innerHeight / 2 +120 && y < innerHeight / 2 + 160) {  
      wx.triggerGC();
      //清楚本地缓存
      wx.clearStorage()
      //退出当前小游戏
      wx.exitMiniProgram()
    }
  }
})

//重置游戏
function reset(){
  wx.triggerGC();
  for (var i in car) {
    scene.remove(car[i]);
    scene.remove(carCube[i]);
  }
  for (var i in house) {
    scene.remove(house[i]);
  }
  for (var i in treeCube) {
    scene.remove(tree[i]);
    scene.remove(treeCube[i]);
  }
  for (var i in coin) {
    scene.remove(coin[i]);
    scene.remove(coinCube[i]);
  }
  for (var i in diamond) {
    scene.remove(diamond[i]);
    scene.remove(diamondCube[i]);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

var frame,temp=-1;
function animate(){
  frame=requestAnimationFrame(animate);
  onWindowResize();

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
    tree[k].position.x -= 0.1;
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

  collision(player, playerVertices, carCube, false, false, function () {
    scene.remove(player);
    setTimeout(function () {
      gameOver = true;
    }, 1000)
  });

  collision(player, playerVertices, treeCube, false,false,function () {
    scene.remove(player);
    setTimeout(function(){
      gameOver=true;
    },1000);
  });

  collision(player, playerVertices, coinCube, true, true, function () {

  });

  collision(player, playerVertices, diamondCube,true,false, function () {

  });

 if(starting){
   hudBitmap.clearRect(0, 0, innerWidth, innerHeight);
   hudTexture.needsUpdate = true;
   gameInfo.startGame(hudBitmap);
 }
 else{
  
   if(score>temp){
     hudBitmap.clearRect(0, 0, innerWidth, innerHeight);
     hudBitmap.drawImage(
       scorePng,
       0, 30,
       73, 22
     );
     hudBitmap.font = "bold 25px Arial";
     hudBitmap.fillText(": " + score, 100, 50);
     hudBitmap.drawImage(
       coinPng,
       0, 80,
       40, 43
     );
     hudBitmap.font = "bold 20px Arial";
     hudBitmap.fillText(" X " + coinNum, 60, 115);

     hudBitmap.drawImage(
       diamondPng,
       0, 130,
       40, 43
     );
     hudBitmap.fillText(" X " + diamondNum, 60, 165);

     hudTexture.needsUpdate = true;
     temp=score;
   }
   
 }

  if(gameOver){
    gameInfo.renderGameOver(hudBitmap, score);
    hudTexture.needsUpdate = true;
    clearInterval(carId);
    clearInterval(objectId);
    clearInterval(houseId);
    cancelAnimationFrame(frame); 
  }

  
  renderer.autoClear = true;
  renderer.render(scene, camera);
  renderer.autoClear = false;
  renderer.render(sceneHUD, cameraHUD);//要放后渲染
}

//load road
function createRoad(){
  loader.load('http://www.shinexr.com:89/rawassets/gltf/road/Unity2Skfb.gltf', function (gltf) {

    scene.add(gltf.scene);

    gltf.scene.children[0].children[0].receiveShadow = true;


    gltf.scene.scale.set(1.5, 1, 1);
    gltf.scene.position.set(40, 0, 1);
    road=gltf.scene;
  });
}

function ready(){

  //Car
  loader.load('http://www.shinexr.com:89/rawassets/gltf/car/car.gltf', function (gltf) {
    gltf.scene.scale.set(0.8, 0.8, 0.8);
    gltf.scene.rotation.y += Math.PI;
    //gltf.scene.children[0].children[0].castShadow = true;
    //gltf.scene.children[0].children[0].receiveShadow = true;
    c0 = gltf.scene;

    c0Cube = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1.3), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true, opacity: 0 }));
  });

  loader.load('http://www.shinexr.com:89/rawassets/gltf/car1/Unity2Skfb.gltf', function (gltf) {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.rotation.y += Math.PI / 2;
    //gltf.scene.children[0].children[0].castShadow = true;
    //gltf.scene.children[0].children[0].receiveShadow = true;
    c1 = gltf.scene;

    c1Cube = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1.3), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true, opacity: 0 }));
  });

  loader.load('http://www.shinexr.com:89/rawassets/gltf/car2/Unity2Skfb.gltf', function (gltf) {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.rotation.y += Math.PI / 2;
    //gltf.scene.children[0].children[0].castShadow = true;
    //gltf.scene.children[0].children[0].receiveShadow = true;
    c2 = gltf.scene;

    c2Cube = new THREE.Mesh(new THREE.BoxGeometry(1, 0.3, 1.3), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true, opacity: 0 }));
  });

 //object
 
  loader.load('http://www.shinexr.com:89/rawassets/gltf/tree//Unity2Skfb.gltf', function (gltf) {
    gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.5, 0.5, 0.5);

    treeObj = gltf.scene;

    tCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 0.8), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true, opacity: 0 }));
  });

 
  loader.load('http://www.shinexr.com:89/rawassets/gltf/coin/Unity2Skfb.gltf', function (gltf) {
    gltf.scene.children[0].children[0].children[0].castShadow = true;

    coinObj = gltf.scene;

    cCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true, opacity: 0 }));
  });

  
  loader.load('http://www.shinexr.com:89/rawassets/gltf/Diamond/Unity2Skfb.gltf', function (gltf) {
    gltf.scene.children[0].children[0].children[0].castShadow = true;

    diamondObj = gltf.scene;

    dCube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 1), new THREE.MeshBasicMaterial({ color: 0x00aaaa, transparent: true, opacity: 0 }));
  });

   //house
 
  loader.load('http://www.shinexr.com:89/rawassets/gltf/Build/Unity2Skfb.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    build0 = gltf.scene;
  });

 
  loader.load('http://www.shinexr.com:89/rawassets/gltf/Build1/Unity2Skfb.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.25, 0.25, 0.25);
    build1 = gltf.scene;
  });


  loader.load('http://www.shinexr.com:89/rawassets/gltf/Build2/build2.gltf', function (gltf) {
    //gltf.scene.children[0].children[0].castShadow = true;
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    build2 = gltf.scene;
  });
}


//load player
function createPlayer() {
  //creat player
  var geo = new THREE.BoxGeometry(0.25, 1, 0.25);
  var mat = new THREE.MeshBasicMaterial({ color: 0x0000ee });
  playerCube = new THREE.Mesh(geo, mat);
  playerVertices = playerCube.geometry.vertices;

  //player
  loader.load('http://www.shinexr.com:89/rawassets/gltf/character/scene.gltf', function (gltf) {
    gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[3].castShadow = true;

    gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].castShadow = true;


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
    scene.add(player);
  });
}


//随机生成car
function createCar(){
 
  //随机生成car
  carId=setInterval(function () {
    var index = getRandomInt(0, 2);
    //var index=2;
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
function createObject(){

  objectId=setInterval(function () {
    var pos = getRandomInt(0, 3);
    //var pos=1;
    if (loader) {
      if (pos == 0 || pos == 3) {
        var t = treeObj.clone();
          var cube=tCube.clone();
          tree.push(t);
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
        if (!c.count) {
          c.count = 1;
        }
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
        if (!d.count) {
          d.count = 1;
        }
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

  //生成房屋
  houseId=setInterval(function () {
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
function collision(player, playerVertices, object,isReward,isCoin, action) {
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
           
            if(isReward){
             
              for (var i in collisionResults) {
                if (collisionResults[i].object.children[0].count==1){
              
                  if(isCoin){
                    score+=5;
                    coinNum++;
                  }
                  else{
                    score+=10;
                    diamondNum++;
                  }
                
                  collisionResults[i].object.children[0].count++;
                  scene.remove(collisionResults[i].object);
                  scene.remove(collisionResults[i].object.children[0]);
                }
               
              }
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