const utils = require('../../src/utils')

describe('utils', function () {
  let env = null

  beforeEach(function () {
    window.addEventListener = sandbox.stub()
    window.attachEvent = sandbox.stub()
    env = process.env.NODE_ENV
  })

  afterEach(function () {
    process.env.NODE_ENV = env
    sandbox.restore()
  })

  describe('_safeParseJSON', function () {
    describe('with bad json', function () {
      it('responds with an empty object', function () {
        expect(utils._safeParseJSON('{"ok":hmm')).to.deep.equal({})
      })
    })
  })

  describe('_on', function () {
    describe('when we have addEventListener', function () {
      it('should add an eventListener', function () {
        utils._on(window, 'load', 'callback')
        expect(window.addEventListener).to.have.been.called()
      })
    })

    describe('on older browsers', function () {
      describe('without addEventListener', function () {
        it('falls back to attachEvent', function () {
          delete window.addEventListener
          utils._on(window, 'load', 'callback')
          expect(window.attachEvent).to.have.been.called()
        })
      })

      describe('without attachEvent', function () {
        it('falls back to window.onload', function () {
          delete window.addEventListener
          delete window.attachEvent
          utils._on(window, 'load', 'callback')
          expect(window.onload).to.equal('callback')
        })
      })
    })
  })

  describe('_onKeyDown', function () {
    let event = null

    beforeEach(function () {
      sandbox.stub(console, 'info')
      event = {
        preventDefault: sandbox.stub()
      }
    })

    it('is ok with no event', function () {
      expect(function () {
        utils._blockNonNumericKeyPress()
      }).not.to.throw()
    })

    describe('when we have no event code (for example in chromedriver)', function () {
      beforeEach(function () {
        utils._blockNonNumericKeyPress(event)
      })

      it('is ok', function () {
        expect(event.preventDefault).not.to.have.been.called()
      })
    })

    describe('when we hit a digit', function () {
      beforeEach(function () {
        event.code = 'Digit1'
        utils._blockNonNumericKeyPress(event)
      })

      it('is ok', function () {
        expect(event.preventDefault).not.to.have.been.called()
      })
    })

    describe('when we cmd-v', function () {
      beforeEach(function () {
        event.code = 'KeyV'
        event.metaKey = true
        utils._blockNonNumericKeyPress(event)
      })

      it('is ok', function () {
        expect(event.preventDefault).not.to.have.been.called()
      })
    })

    describe('when we ctrl-v', function () {
      beforeEach(function () {
        event.code = 'KeyV'
        event.ctrlKey = true
        utils._blockNonNumericKeyPress(event)
      })

      it('is ok', function () {
        expect(event.preventDefault).not.to.have.been.called()
      })
    })

    describe('when we hit a cursor', function () {
      beforeEach(function () {
        event.code = 'ArrowFoo'
        utils._blockNonNumericKeyPress(event)
      })

      it('is ok', function () {
        expect(event.preventDefault).not.to.have.been.called()
      })
    })

    describe('when we hit tab', function () {
      beforeEach(function () {
        event.code = 'Tab'
        utils._blockNonNumericKeyPress(event)
      })

      it('is ok', function () {
        expect(event.preventDefault).not.to.have.been.called()
      })
    })

    describe('when we hit backspace', function () {
      beforeEach(function () {
        event.code = 'Backspace'
        utils._blockNonNumericKeyPress(event)
      })

      it('is ok', function () {
        expect(event.preventDefault).not.to.have.been.called()
      })
    })

    describe('when we hit anything else', function () {
      describe('in production', function () {
        beforeEach(function () {
          process.env.NODE_ENV = 'production'
          event.code = 'KeyX'
          utils._blockNonNumericKeyPress(event)
        })

        it('does not accept it', function () {
          expect(event.preventDefault).to.have.been.calledOnce()
        })

        it('does so quietly', function () {
          expect(console.info).not.to.have.been.called()
        })
      })

      describe('in other environments', function () {
        beforeEach(function () {
          event.code = 'KeyX'
          utils._blockNonNumericKeyPress(event)
        })

        it('tells us about it in the console', function () {
          expect(console.info).to.have.been.calledOnce()
        })
      })
    })
  })
})
