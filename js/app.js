import { debounce } from './utils/debounce.js'
import './components/collapse.js'

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

const displayCharacters = (characters) => {
  const htmlString = characters
    .map(({ name, house, image, ...extra }) => {
      const houseString = house ? `<p>House: ${house}</p>` : ''
      const extraString = Object.entries(extra)
        .map(([key, value]) => `<p>${key}: ${value}</p>`)
        .join('')

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
