const chai = require('chai')

global.document = require('jsdom').jsdom('<!doctype html><html><body></body></html>')
global.window = document.parentWindow
global.navigator = window.navigator

chai.config.includeStack = true

chai.use(require('dirty-chai'))
chai.use(require('sinon-chai'))

global.expect = chai.expect

global.sinon = require('sinon')
global.sandbox = global.sinon.sandbox.create()
