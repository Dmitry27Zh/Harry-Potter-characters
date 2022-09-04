const TIMEOUT = 2000

const debounce = (cb, timeout = TIMEOUT, ...initialArgs) => {
  let timerId

  return function (...args) {
    clearInterval(timerId)
    timerId = setTimeout(() => cb.call(this, ...initialArgs, ...args), timeout)
  }
}

export { debounce }
