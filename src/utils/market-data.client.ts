type Request = {
  endpoint: string
  token?: string
  authHeader?: string
  cacheTtl?: number
}

export async function requestMarketData<T>({
  endpoint,
  token,
  cacheTtl,
  authHeader = 'Authorization',
}: Request): Promise<T> {
  const response = await fetch(endpoint, {
    cf: {
      cacheTtl: cacheTtl ?? 4 * 60 * 60,
      cacheEverything: true,
    },

    ...(token
      ? {
          headers: {
            [authHeader]: token,
          },
        }
      : {}),
  })

  if (!response.ok) {
    throw new Error(
      `[MARKET_API_ERROR] ${response.status} - ${response.statusText}`,
    )
  }

  return response.json()
}
