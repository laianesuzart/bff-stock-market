import { HTTPException } from 'hono/http-exception'
import { fetchStockQuote, fetchTickers } from '../providers/stock.provider'
import { calculateRange } from '../utils/date.utils'

export async function getStockWithHistory(
  tickers: string,
  start: Date,
  end: Date,
) {
  const range = calculateRange(start)
  const symbols = tickers.split(',')

  if (symbols.length > 20) {
    throw new HTTPException(400, {
      message: `Symbols length: ${symbols.length}. Max length: 20`,
    })
  }

  const res = await fetchStockQuote(tickers, range)

  const filteredResults = res.map((stock) => {
    const filteredHistory = stock.history.filter((h) => {
      const isAfterStart = h.date >= start
      const isBeforeEnd = h.date <= end

      return isAfterStart && isBeforeEnd
    })

    return { ...stock, history: filteredHistory }
  })

  let maxLen = 0
  let maxLenIndex = -1

  filteredResults.forEach((stock, index) => {
    if (stock.history.length > maxLen) {
      maxLen = stock.history.length
      maxLenIndex = index
    }
  })

  const stockQueryPeriod =
    maxLenIndex !== -1
      ? filteredResults[maxLenIndex].history.map((h) =>
          new Date(h.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          }),
        )
      : []

  const dateIndexMap = new Map<number, number>()

  if (maxLenIndex !== -1) {
    filteredResults[maxLenIndex].history.forEach((h, index) => {
      dateIndexMap.set(h.date.getTime(), index)
    })
  }

  const results = filteredResults.map((stock) => {
    const prices = new Array(maxLen).fill(null)

    stock.history.forEach((h) => {
      const index = dateIndexMap.get(h.date.getTime())
      if (index !== undefined) {
        prices[index] = h.price
      }
    })

    return {
      ...stock,
      history: prices,
    }
  })

  return { symbols, stockQueryPeriod, results }
}

export async function getTickerList(type: string) {
  const data = await fetchTickers(type)

  return data.tickers.filter((ticker) => !ticker.endsWith('F'))
}
