const apiURL = process.env.REACT_APP_API_URL

async function client(
  endpoint,
  {data, headers: customHeaders,  ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}
//client for login
async function Loginclient(
  {idtoken},
) {
  
  const config = {
    method: 'POST',
    body: JSON.stringify({idtoken}),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return window.fetch(`${apiURL}/login`, config).then(async response => {
    const user = await response.json()
    if (response.ok) {
      return user
    } else {
      return null
    }
  })
}
export {client, Loginclient}
