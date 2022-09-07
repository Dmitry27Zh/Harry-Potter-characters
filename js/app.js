import { debounce } from './utils/debounce.js'
import './components/collapse.js'
import { capitalize, getStringWithoutCase } from './utils/string.js'

const URL = 'http://hp-api.herokuapp.com/api/characters'
const charactersList = document.getElementById('characters-list')
const DEBOUNCE_TIMEOUT = 1000

const initSearch = (characters) => {
  const searchBar = document.getElementById('search-bar')

  const onSearchBarInput = debounce((e) => {
    const searchString = e.target.value.trim().toLowerCase()

    const filteredCharacters = characters.filter((character) => {
      const { name, house } = character
      const values = [name, house]
      return values.some((value) => value.toLowerCase().includes(searchString))
    })

    displayCharacters(filteredCharacters)
  }, DEBOUNCE_TIMEOUT)

  searchBar.addEventListener('input', onSearchBarInput)
}

const loadCharacters = async () => {
  try {
    const res = await fetch(URL)
    const characters = await res.json()
    displayCharacters(characters)
    initSearch(characters)
  } catch (e) {
    console.error(e)
  }
}

loadCharacters()

const getValueString = (value) => {
  switch (typeof value) {
    case 'boolean':
      return value ? 'yes' : 'no'
    case 'object':
      if (Array.isArray(value)) {
        return value.join(', ')
      }

      const sub = Object.entries(value).map(getPropertyString).join('')
      return sub ? `<div class="extra-sub">${sub}</div>` : ''
    default:
      return value
  }
}

const getPropertyString = ([key, value]) => {
  const valueString = getValueString(value)

  if (!valueString) {
    return ''
  }

  const keyString = capitalize(getStringWithoutCase(key))
  return `<p>${keyString}: ${valueString}</p>`
}

const displayCharacters = (characters) => {
  const htmlString = characters
    .map(({ name, house, image, ...extra }) => {
      const houseString = house ? `<p>House: ${house}</p>` : ''
      const extraString = Object.entries(extra).map(getPropertyString).join('')

      return `
        <li class="character collapse" data-collapse>
          <div class="character-main">
            <h3>${name}</h3>
            ${houseString}
            <img src="${image}" />
            <button class="collapse__toggle" type="button" data-collapse-toggle>More</button>
          </div>
          <div class="collapse__section" data-collapse-section>
            <div class="character-extra">${extraString}</div>
          </div>
        </li>
      `
    })
    .join('')

  charactersList.innerHTML = htmlString
}
