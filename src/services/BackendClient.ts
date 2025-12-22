const fetchData = async <RESPONSE>(
  url: string,
  method: string = 'GET',
  body?: any,
): Promise<RESPONSE> => {
  try {
    return await fetch(import.meta.env.VITE_BACKEND_URL + url, {
      method: method,
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          btoa(
            `${import.meta.env.VITE_BACKEND_AUTH_USER}:${import.meta.env.VITE_BACKEND_AUTH_PASSWORD}`,
          ),
      }),
    }).then(async (response) => {
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      if (!response.ok) {
        throw new Error(
          `Response: ${response.status} / StatusText: ${response.statusText} / Response: ${await response.json().catch(() => undefined)}`,
        )
      }
      return await response.json()
    })
  } catch (e) {
    throw new Error(`Unexpected error: ${e}`)
  }
}

const fetchDataAndIgnoreResponse = async (url: string, method: string = 'GET', body?: any) => {
  try {
    fetch(import.meta.env.VITE_BACKEND_URL + url, {
      method: method,
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          btoa(
            `${import.meta.env.VITE_BACKEND_AUTH_USER}:${import.meta.env.VITE_BACKEND_AUTH_PASSWORD}`,
          ),
      }),
    }).then(async (response) => {
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      if (!response.ok) {
        throw new Error(
          `Response: ${response.status} / StatusText: ${response.statusText} / Response: ${await response.json().catch(() => undefined)}`,
        )
      }
    })
  } catch (e) {
    throw new Error(`Unexpected error: ${e}`)
  }
}

export const BackendClient = {
  fetchData,
  fetchDataAndIgnoreResponse,
}
