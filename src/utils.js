const utils = module.exports = {}

utils._on = (element, eventType, callback) => {
  if (!element) return
  if (element.addEventListener) element.addEventListener(eventType, callback, false)
  else if (element.attachEvent) element.attachEvent('on' + eventType, callback)
  else element['on' + eventType] = callback
}

utils._safeParseJSON = json => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return {}
  }
}

/* // attach as a key down event and block non numerics
utils._blockNonNumericKeyPress = event => {
  if (!event || !event.code) return
  if (/^(Arrow|Digit|Tab|Back)/.test(event.code)) return
  // allow pasting?
  if (event.code === 'KeyV' && (event.metaKey || event.ctrlKey)) return
  // Could use event.which instead but it's depracated apparently
  // if ([8, 9, 37, 38, 39, 40, 49, 50, 51, 52, 53, 54, 55, 56, 57].indexOf(event.which) !== -1) return
  if (process.env.NODE_ENV !== 'production') console.info('blocking key press', event.code)
  event.preventDefault()
} */
