/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2020-06-07 17:27
 */
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

let globalIndex = 1

/**
 * add finally logic
 */
class ZxPromise {
  callbacks = []
  // state
  state = PENDING
  // cache result
  value = null

  index = globalIndex++

  constructor (fn) {
    console.log(`[ZxPromise ${this.index}]`, 'constructor')
    fn(this._resolveHandler.bind(this), this._rejectHandler.bind(this))
  }

  then (onFulfilled, onRejected) {
    console.log(`[ZxPromise ${this.index}]`, 'then')
    return new ZxPromise((resolve, reject) => {
      this._handle({
        resolve,
        onFulfilled,
        reject,
        onRejected
      })
    })
  }

  catch (onError) {
    console.log(`[ZxPromise ${this.index}]`, 'catch')
    return this.then(null, onError)
  }

  finally (onDone) {
    console.log(`[ZxPromise ${this.index}]`, 'finally')
    if (typeof onDone !== 'function') return this.then()
    const that = this.constructor
    return this.then(value => {
      that.resolve(onDone()).then(() => value)
    }, reason => {
      that.resolve(onDone()).then(() => {
        throw reason
      })
    })
  }

  _handle ({ onFulfilled, resolve, onRejected, reject }) {
    console.log(`[ZxPromise ${this.index}]`, '_handle')
    if (this.state === PENDING) {
      this.callbacks.push({ onFulfilled, resolve, onRejected, reject })
      return
    }
    try {
      if (this.state === FULFILLED) {
        if (!onFulfilled) {
          resolve(this.value)
          return
        }
        // 把函数onFulfilled返回的结果，传递给下一个then
        resolve(onFulfilled(this.value))
      } else {
        if (!onRejected) {
          reject(this.value)
          return
        }
        reject(onRejected(this.value))
      }
    } catch (err) {
      reject(err)
    }
  }

  _resolveHandler (value) {
    console.log(`[ZxPromise ${this.index}]`, '_resolveHandler')
    // value 为ZxPromise
    if (value instanceof ZxPromise) {
      let then = value.then
      if (typeof then === 'function') {
        then.call(value, this._resolveHandler.bind(this))
        return
      }
    }
    // value 为普通值
    this.state = FULFILLED
    this.value = value
    this.callbacks.forEach(fn => this._handle(fn))
  }

  _rejectHandler (err) {
    console.log(`[ZxPromise ${this.index}]`, '_rejectHandler')
    this.state = REJECTED
    this.value = err
    this.callbacks.forEach(fn => this._handle(fn))
  }
}


new ZxPromise((resolve, reject) => {
  console.log('instance')
  setTimeout(() => {
    // resolve('world')
    reject('test5 error')
  }, 100)
}).then(res => {
  console.log('then1', res)
  return 'the text from then1 return'
}).then(res => {
  console.log('then2', res)
  return new ZxPromise(re => {
    setTimeout(() => {
      re('new ZxPromise instance')
    }, 100)
  })
}).then(res => {
  console.log('then3', res)
  return 'the text from then3 return'
}).then(res => {
  console.log('then4', res)
}, err => {
  console.error(err)
}).finally(() => {
  console.log('finally')
})
