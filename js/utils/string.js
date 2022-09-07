const capitalize = (str) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

const getStringWithoutCase = (str) => {
  return str
    .split(/_|(?=[A-Z])/)
    .join(' ')
    .toLowerCase()
}

export { capitalize, getStringWithoutCase }
