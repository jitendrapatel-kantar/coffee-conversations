import { client } from "./api-client"
const localStorageKey = '__auth_provider_token__'

async function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse({user, idtoken}) {
  console.log(user, 'handleUser')
  window.localStorage.setItem(localStorageKey, idtoken)
  return null
}

function login({idtoken}) {
  return client('login', {data: {idtoken}}).then((user) => handleUserResponse({user, idtoken}))
}


async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

export {getToken, login, logout, localStorageKey}