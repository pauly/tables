/* global localStorage */

const utils = require('./utils')

const game = module.exports = {}
const lengthOfGame = 60
const minQuestion = 2
const maxTable = 16
const maxQuestion = 14
const maxQuestions = 12
const _createElement = document.createElement.bind(document)

function appendChild (element, child) {
  element.appendChild(child)
}

function shuffle (array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

game._store = (item, value) => {
  localStorage.setItem(item, JSON.stringify(value))
}

game._fetch = item => {
  try {
    return JSON.parse(localStorage.getItem(item))
  } catch (e) {

  }
}

game._click = event => {
  game.attempts ++
  if (event.target.innerHTML === '' + game._currentAnswer) {
    event.target.className = 'correct'
    game.score ++
  } else {
    event.target.className = 'incorrect'
  }
  setTimeout(() => {
    event.target.className = ''
  }, 100)
  game._play()
}

game._updateTimer = () => {
  game._timerSection.innerHTML ++
  game._timerSection.style['margin-right'] = (((lengthOfGame - game._timerSection.innerHTML) / lengthOfGame) * 100) + '%'
  if (game._timerSection.innerHTML >= lengthOfGame) game._gameOver()
}

game._confirm = (message, callback) => {
  game.div.innerHTML = ''
  const question = _createElement('p')
  question.innerHTML = message
  appendChild(game.div, question)
  const button = _createElement('button')
  button.innerHTML = 'OK'
  appendChild(question, button)
  utils._on(button, 'click', event => {
    game.div.removeChild(question)
    callback(event.target)
  })
}

game._gameOver = () => {
  clearInterval(game._interval)
  let message = 'You scored ' + game.score
  if (game.score > game.highScore) {
    game.highScore = game.score
    message += ' - new high score!'
  } else {
    message += ' - high score is ' + game.highScore
  }
  message += ' - click OK to play again'
  game._store('gameHighScore', game.highScore)
  game._confirm(message, game._start)
}

game._updateOptions = event => {
  const number = parseInt(event.target.innerHTML, 10)
  const index = game._tables.indexOf(number)
  if (index === -1) {
    event.target.className = ''
    game._tables.push(number)
  } else {
    event.target.className = 'disabled'
    game._tables.splice(index, 1)
  }
  game._store('tables', game._tables)
  game._init()
}

game._init = () => {
  if (!game.div) {
    game.div = _createElement('div')
    appendChild(document.body, game.div)
  }
  if (!game._timerSection) {
    game._timerSection = _createElement('p')
    game._timerSection.className = 'timer'
    appendChild(document.body, game._timerSection)
  }
  if (!game._scoreSection) {
    game._scoreSection = _createElement('p')
    appendChild(game.div, game._scoreSection)
  }
  game._tables = game._fetch('tables') || [maxTable]
  if (!game._options) {
    game._options = _createElement('p')
    game._options.className = 'options'
    appendChild(document.body, game._options)
    for (let i = minQuestion; i <= maxTable; i++) {
      const button = _createElement('button')
      button.style.transform = 'rotate(' + Math.floor((Math.random() * 6) - 3) + 'deg)'
      button.className = game._tables.indexOf(i) === -1 ? 'disabled' : ''
      button.innerHTML = i
      utils._on(button, 'click', game._updateOptions)
      appendChild(game._options, button)
    }
  }
  /* if (!game._photo) {
    game._photo = _createElement('input')
    game._photo.type = 'file'
    game._photo.accept = 'image/*'
    appendChild(document.body, game._photo)
    utils._on(game._photo, 'change', event => {
      const files = event.target.files
      if (!files || !files.length) return
      console.log(files)
    })
  } */
  game.attempts = 0
  game.score = 0
  game._timerSection.innerHTML = 0
  game.highScore = game._fetch('gameHighScore')
  game._buttons = []
  for (let thisTable of game._tables) {
    for (let i = minQuestion; i <= maxQuestion; i++) {
      const button = _createElement('button')
      button.style.transform = 'rotate(' + Math.floor((Math.random() * 6) - 3) + 'deg)'
      button.question = i + ' x ' + thisTable
      button.innerHTML = i * thisTable
      utils._on(button, 'click', game._click)
      game._buttons.push(button)
    }
  }
  game._buttonsHTML = _createElement('div')
  shuffle(game._buttons)
  game._buttons = game._buttons.slice(0, maxQuestions)
  for (let button of game._buttons) {
    appendChild(game._buttonsHTML, button)
  }
}

game._play = () => {
  game.div.innerHTML = ''
  appendChild(game.div, game._buttonsHTML)
  const p = _createElement('p')
  let randomButton = null
  while (!randomButton || (game._currentAnswer === randomButton.innerHTML)) {
    randomButton = game._buttons[Math.floor(Math.random() * game._buttons.length)]
  }
  p.innerHTML = (game.attempts + 1) + '. What is ' + randomButton.question + '?'
  game._currentAnswer = randomButton.innerHTML
  appendChild(game.div, p)
  game._scoreSection.innerHTML = 'Score: ' + game.score + '/' + game.attempts
}

game._start = () => {
  game._init()
  game._confirm('Ready to play..?', () => {
    game._interval = setInterval(game._updateTimer, 1000)
    game._play()
  })
}

game._start()
