type Request = {
  endpoint: string
  cacheTtl?: number
}

export async function requestMarketData<T>({
  endpoint,
  cacheTtl,
}: Request): Promise<T> {
  const response = await fetch(endpoint, {
    cf: {
      cacheTtl: cacheTtl ?? 4 * 60 * 60,
      cacheEverything: true,
    },
  })

  if (!response.ok) {
    throw new Error(
      `[MARKET_API_ERROR] ${response.status} - ${response.statusText}`,
    )
  }

  return response.json()
}
