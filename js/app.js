const URL = 'http://hp-api.herokuapp.com/api/characters'
const charactersList = document.getElementById('characters-list')

const loadCharacters = async () => {
  try {
    const res = await fetch(URL)
    const characters = await res.json()
    displayCharacters(characters)
  } catch (e) {
    console.error(e)
  }
}

loadCharacters()

const displayCharacters = (characters) => {
  const htmlString = characters
    .map(({ name, house, image }) => {
      const houseString = house ? `<p>House: ${house}</p>` : ''

      return `
        <li class="character">
          <h3>${name}</h3>
          ${houseString}
          <img src="${image}" />
        </li>
      `
    })
    .join('')

  charactersList.innerHTML = htmlString
}
