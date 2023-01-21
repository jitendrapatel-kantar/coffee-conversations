import { Loginclient } from "./api-client"
const localStorageKey = '__auth_provider_token__'

async function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function handleUserResponse({user, idtoken}) {
  window.localStorage.setItem(localStorageKey, idtoken)
  if(user.code === 500){
    return null
  }
  
  return user
}

function login({idtoken}) {
  console.log(idtoken, 'token')
  return Loginclient({idtoken}).then((user) => handleUserResponse({user, idtoken}))
}


async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

export {getToken, login, logout, localStorageKey}