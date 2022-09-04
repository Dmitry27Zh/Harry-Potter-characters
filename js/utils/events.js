const addTargetEventListener = (element, eventType, handler, once, options) => {
  element.addEventListener(eventType, modifiedHandler, options)

  function modifiedHandler({ target, currentTarget }) {
    if (target !== currentTarget) {
      return
    }

    if (once) {
      element.removeEventListener(eventType, modifiedHandler, options)
    }

    handler.call(this)
  }
}

export { addTargetEventListener }
