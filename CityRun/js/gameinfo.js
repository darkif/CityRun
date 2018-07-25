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

let move = new Image()
move.src = 'images/move.png'

let bg = new Image()
bg.src = 'images/mainBG.png'

export default class GameInfo {
//开始ui
  startGame(ctx) {
    ctx.drawImage(
      bg,
      0,
      0,
      innerWidth, innerHeight
    )


    ctx.drawImage(
      start,
      screenWidth / 2-90 ,
      screenHeight / 2 +150,
      screenWidth / 2, screenHeight /10
    )


  }
  //explain game 
  explainGame(ctx) {
      ctx.drawImage(
        move,
        innerWidth / 2 - 265,
        innerHeight / 2 - 400,
        540, 960
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