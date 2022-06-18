export const getPokemon = (value) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${value}`, {
    method: 'get',
  })
}


export const getItem = (url) => {
  return fetch(`${url}`)
}
