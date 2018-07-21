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


export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      score,
      10,
      30
    )
  }
  startGame(ctx) {

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 40px Arial"

    ctx.drawImage(
      start,
      screenWidth / 2-110 ,
      screenHeight / 2 +100,
      228,100
    )


  }

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

