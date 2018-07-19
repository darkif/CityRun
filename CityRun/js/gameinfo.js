const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'

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
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2-100, screenHeight / 2-50, 200, 200)

    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 + 45,
      120, 40
    )
    ctx.fillText(
      '开始游戏',
      screenWidth / 2,
      screenHeight / 2 + 70
    )
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 ,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 ,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2-60,
      screenHeight / 2+105 ,
      120, 40
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 +45,
      120, 40
    )


    ctx.fillText(
      '退出',
      screenWidth / 2 ,
      screenHeight / 2+130 
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2,
      screenHeight / 2 +70
    )
  }
}

