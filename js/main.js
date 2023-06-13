const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

const ROW = 18
const COL = 10
const SQ = 30
const COLOR = '#f0f0f0'
let score = 0

function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * SQ, y * SQ, SQ, SQ)

    context.strokeStyle = '#1129A6'
    context.strokeRect(x * SQ, y * SQ, SQ, SQ)
}

let board = []
for(r = 0; r < ROW; r++) {
    board[r] = []
    for(c = 0; c < COL; c++) {
        board[r][c] = COLOR
    }
}

function drawBoard() {
    for(r = 0; r < ROW; r++) {
        for(c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard()

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino
        this.color = color

        this.x = 3
        this.y = -2

        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN]
    }

    fill(color) {
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                if(this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color)
                }
            }
        }
    }

    draw() {
        this.fill(this.color)
    }

    undraw() {
        this.fill(COLOR)
    }

    moveDown() {
        if(!this.collistion(0, 1, this.activeTetromino)){
            this.undraw()
            this.y++
            this.draw()
        } else {
            this.lock()
            p = radomPiece()
        }
        
    }

    moveLeft() {
        if(!this.collistion(-1, 0, this.activeTetromino)){
            this.undraw()
            this.x--
            this.draw()
        }
    }

    moveRight() {
        if(!this.collistion(1, 0, this.activeTetromino)){
            this.undraw()
            this.x++
            this.draw()
        }
    }

    lock() {
        let audioGameover = new Audio('./assets/audio/mixkit-arcade-game-opener-222.wav')
        let audioFull = new Audio('./assets/audio/mixkit-player-jumping-in-a-video-game-2043.wav')
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                if(!this.activeTetromino[r][c]) {
                    continue
                }
                if(this.y + r < 0) {
                    audioGameover.play()
                    setTimeout(function(){
                        alert('gameOver')
                        gameOver = true
                    }, 1000)
                    break
                }
                board[this.y + r][this.x + c] = this.color
            }
        }

        for(let r = 0; r < ROW; r++) {
            let isFull = true
            for(let c = 0; c < COL; c++) {
                isFull = isFull && (board[r][c] != COLOR)
            }

            if(isFull) {
                for(let y = r; y > 1; y--) {
                    for(let c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c]
                    }
                }
                for(let c = 0; c < COL; c++) {
                    board[0][c] = COLOR;
                }
                audioFull.play()
                score += 10
            }
        }
        drawBoard()
        document.querySelector('#score').innerText = score;
    }

    collistion(x, y, piece) {
        for(let r = 0; r < piece.length; r++) {
            for(let c = 0; c < piece.length; c++) {
                if(!piece[r][c]) {
                    continue
                }

                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if(newX < 0 || newX >= COL || newY >= ROW ) {
                    return true
                }

                if(newY < 0) {
                    continue
                }

                if(board[newY][newX] != COLOR) {
                    return true
                }
            }
        }
        return false
    }

    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]
        let move = 0
        if(this.collistion(0, 0, nextPattern)) {
            if(this.x > COL / 2) {
                move = -1
            } else {
                move = 1
            }
        }
        if(!this.collistion(0, 0, nextPattern)){
            this.undraw()
            this.x += move
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length
            this.activeTetromino = this.tetromino[this.tetrominoN]
            this.draw()
        }
    }
}

const PIECES = [
    [I, 'red'],
    [J, 'blue'],
    [O, 'green'],
    [S, 'yellow'],
    [T, 'purple'],
]

function radomPiece() {
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1])
}

let p = radomPiece()
let moveAudio = new Audio('./assets/audio/mixkit-game-ball-tap-2073.wav')

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 37) {
        p.moveLeft()
        moveAudio.play()
    } else if (e.keyCode == 39) {
        p.moveRight()
        moveAudio.play()
    } else if (e.keyCode == 38) {
        p.rotate()
        moveAudio.play()
    } else if (e.keyCode == 40) {
        p.moveDown()
        moveAudio.play()
    }
})

let gameOver  = false
let interval 

function drop() {
    interval = setInterval(function(){
        if(!gameOver) {
            p.moveDown()
        } else {
            clearInterval()
        }
    }, 1000)
}

drop()