const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/bg.png'

let replay = new Image()
replay.src = 'images/replay.png'

let exit = new Image()
exit.src = 'images/exit.png'

let start = new Image()
start.src = 'images/start.png'

let mask = new Image()
mask.src = 'images/mask.png'

let tag = new Image()
tag.src = 'images/tag.png'

let explain = new Image()
explain.src = 'images/explain.png'

let target = new Image()
target.src = 'images/target.png'




export default class GameInfo {
//开始ui
  startGame(ctx) {
    ctx.drawImage(
      mask,
      0,
      0,
      1080, 1920
    )

    ctx.drawImage(
       tag,
       innerWidth/2-100,
       innerHeight / 2-250,
       211,100
     )

    ctx.drawImage(
      explain,
      innerWidth / 2 - 120,
      innerHeight / 2 - 100,
      284, 46
    )

    ctx.drawImage(
      target,
      innerWidth / 2 - 120,
      innerHeight / 2 ,
      248, 17
    )

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 40px Arial"

    ctx.drawImage(
      start,
      screenWidth / 2-110 ,
      screenHeight / 2 +100,
      228,100
    )


  }


//游戏结束UI
  renderGameOver(ctx, score) {
    ctx.drawImage(atlas,  screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 250)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 30px verdana"


    ctx.fillText(
      '  Score: ' ,
      screenWidth / 2 ,
      screenHeight / 2 - 100 + 130
    )

    ctx.fillText(
      score,
      screenWidth / 2,
      screenHeight / 2 + 85
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2-60,
      screenHeight / 2+105 ,
      120, 40
    )

    ctx.drawImage(
      replay,
      screenWidth / 2 +25,
      screenHeight / 2 + 115,
      50, 50
    )

    ctx.drawImage(
      exit,
      screenWidth / 2 -80,
      screenHeight / 2 + 115,
      50, 50
    )

  }
}

