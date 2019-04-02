/* global localStorage */

const utils = require('./utils')

const game = module.exports = {}

const defaultOptions = {
  min: 2,
  max: 12,
  time: 60,
  answers: 12,
  upTo: 16,
  tables: [16],
  highScore: 0
}
const body = document.body
const _createElement = document.createElement.bind(document)

const random = number => Math.floor(Math.random() * number)

function setClass (element, className) {
  element.className = className
}

function appendChild (element, child) {
  element.appendChild(child)
}

function setInnerHTML (element, content) {
  element.innerHTML = content
  /* if (typeof content === 'string') {
    element.innerHTML = content
    return
  }
  while (element.lastChild) {
    element[removeChild](element.lastChild)
  }
  appendChild(element, content) */
}

function shuffle (array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = random(i + 1)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function store (item, value) {
  localStorage.setItem(item, JSON.stringify(value))
}

function fetch (item) {
  try {
    return utils._safeParseJSON(localStorage.getItem(item))
  } catch (e) {}
}

game._click = event => {
  game._attempts++
  if (event.target.innerHTML === '' + game._currentAnswer) {
    setClass(event.target, 'correct')
    game._score++
  } else {
    setClass(event.target, 'incorrect')
  }
  setTimeout(() => {
    setClass(event.target, '')
  }, 100)
  game._play()
}

game._updateTimer = () => {
  game._timerSection.innerHTML++
  game._timerSection.style['margin-right'] = (((game._data.time - game._timerSection.innerHTML) / game._data.time) * 100) + '%'
  if (parseInt(game._timerSection.innerHTML, 10) >= parseInt(game._data.time, 10)) {
    game._gameOver()
  }
}

game._confirm = (message, callback) => {
  setInnerHTML(game._div, '')
  const question = _createElement('p')
  setClass(question, 'game')
  setInnerHTML(question, message)
  appendChild(game._div, question)
  const button = _createElement('button')
  setInnerHTML(button, 'OK')
  appendChild(question, button)
  utils._on(button, 'click', event => {
    game._div.removeChild(question)
    callback(event.target)
  })
}

game._gameOver = () => {
  clearInterval(game._interval)
  let message = 'You scored ' + game._score
  if (game._score > game._data.highScore) {
    game._data.highScore = game._score
    message += ' - new high score!'
  } else {
    message += ' - high score is ' + game._data.highScore
  }
  message += ' - click OK to play again'
  store('data', game._data)
  game._confirm(message, game._start)
}

game._updateOptions = event => {
  const number = parseInt(event.target.innerHTML, 10)
  const index = game._data.tables.indexOf(number)
  if (index === -1) {
    setClass(event.target, '')
    game._data.tables.push(number)
  } else {
    setClass(event.target, 'disabled')
    game._data.tables.splice(index, 1)
  }
  store('data', game._data)
  game._init()
}

game._init = () => {
  if (!game._div) {
    game._div = _createElement('div')
    appendChild(body, game._div)
  }
  if (!game._timerSection) {
    game._timerSection = _createElement('p')
    setClass(game._timerSection, 'timer')
    appendChild(body, game._timerSection)
  }
  if (!game._scoreSection) {
    game._scoreSection = _createElement('p')
    appendChild(game._div, game._scoreSection)
  }
  game._data = Object.assign({}, defaultOptions, fetch('data'))
  if (!game._optionsSection) {
    game._optionsSection = _createElement('div')
    setClass(game._optionsSection, 'options')
    appendChild(body, game._optionsSection)
  }
  setInnerHTML(game._optionsSection, '')
  const link = _createElement('p')
  setInnerHTML(link, 'Options; tables to include:')
  appendChild(game._optionsSection, link)
  utils._on(link, 'click', () => {
    setClass(game._optionsSection, 'ok')
  })
  const tablesWrapper = _createElement('p')
  appendChild(game._optionsSection, tablesWrapper)
  for (let i = game._data.min; i <= game._data.upTo; i++) {
    const button = _createElement('button')
    setClass(button, game._data.tables.indexOf(i) === -1 ? 'disabled' : '')
    setInnerHTML(button, i)
    utils._on(button, 'click', game._updateOptions)
    appendChild(tablesWrapper, button)
  }
  const p = _createElement('p')
  appendChild(game._optionsSection, p)
  for (let key in game._data) {
    if (key !== 'tables') { // dealt with separately above
      const label = _createElement('label')
      setInnerHTML(label, key + ':')
      const input = _createElement('input')
      input.value = game._data[key]
      input.type = 'number'
      appendChild(label, input)
      // appendChild(game._optionsSection, label)
      appendChild(p, label)
      utils._on(input, 'change', event => {
        game._data[key] = event.target.value
        console.log(key, 'is now', event.target.value, game._data)
        store('data', game._data)
        game._init()
      })
    }
  }
  /* if (!game._photo) {
    game._photo = _createElement('input')
    game._photo.type = 'file'
    game._photo.accept = 'image/*'
    appendChild(body, game._photo)
    utils._on(game._photo, 'change', event => {
      const files = event.target.files
      if (!files || !files.length) return
      console.log(files)
    })
  } */
  game._attempts = 0
  game._score = 0
  setInnerHTML(game._timerSection, 0)
  game._buttons = []
  for (let thisTable of game._data.tables) {
    for (let i = game._data.min; i <= game._data.max; i++) {
      const button = _createElement('button')
      button.style.transform = 'rotate(' + (random(6) - 3) + 'deg)'
      button._question = i + ' x ' + thisTable
      setInnerHTML(button, i * thisTable)
      utils._on(button, 'click', game._click)
      game._buttons.push(button)
    }
  }
  game._buttonsHTML = _createElement('p')
  setClass(game._buttonsHTML, 'game')
  shuffle(game._buttons)
  game._buttons = game._buttons.slice(0, game._data.answers)
  for (let button of game._buttons) {
    appendChild(game._buttonsHTML, button)
  }
}

game._play = () => {
  setInnerHTML(game._div, '')
  appendChild(game._div, game._buttonsHTML)
  const p = _createElement('p')
  let randomButton = null
  while (!randomButton || (game._currentAnswer === randomButton.innerHTML)) {
    randomButton = game._buttons[random(game._buttons.length)]
  }
  p.innerHTML = (game._attempts + 1) + '. What is ' + randomButton._question + '?'
  game._currentAnswer = randomButton.innerHTML
  appendChild(game._div, p)
  setInnerHTML(game._scoreSection, 'Score: ' + game._score + '/' + game._attempts)
}

game._start = () => {
  game._init()
  game._confirm('Ready to play..?', () => {
    game._interval = setInterval(game._updateTimer, 1000)
    game._play()
  })
}

game._start()
