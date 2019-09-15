import * as nunjucks from 'nunjucks'
import { SetAsyncExtension } from './setAsync'

type Callback = (a: any, b: any) => void

describe('SetAsyncExtension', function() {
  it('should render the template with My async content using setAsync without parens', function(done) {
    const env = new nunjucks.Environment()
    env.addExtension('SetAsyncExtension', new SetAsyncExtension())
    env.addGlobal('test', function(cb: Callback) {
      setTimeout(_ => {
        cb(null, 'My async content')
      }, 50)
    })
    env.renderString('{% setAsync "name", test, [] %}{{name}}', (err: any, content: any) => {
      expect(content).toEqual('My async content')
      done()
    })
  })

  it('should render the template with My async content using setAsync with parens', function(done) {
    const env = new nunjucks.Environment()
    env.addExtension('SetAsyncExtension', new SetAsyncExtension())
    env.addGlobal('test', function(cb: Callback) {
      setTimeout(_ => {
        cb(null, 'My async content')
      }, 50)
    })
    env.renderString('{% setAsync ("name", test, []) %}{{name}}', (err: any, content: any) => {
      expect(content).toEqual('My async content')
      done()
    })
  })
})
