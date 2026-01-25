import { fetchStockQuote } from '../providers/market.provider'
import { calculateRange } from '../utils/date.utils'

export async function getStockWithHistory(
  tickers: string,
  start: Date,
  end: Date,
) {
  const range = calculateRange(start)
  const symbols = tickers.split(',')

  const res = await fetchStockQuote(tickers, range)

  const filteredResults = res.map((stock, index) => {
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

  const results = filteredResults.map((stock) => {
    const prices = stock.history.map((h) => h.price)
    const diff = maxLen - prices.length

    const padding = diff > 0 ? new Array(diff).fill(null) : []
    console.log({ diff, name: stock.symbol })
    return {
      ...stock,
      history: [...padding, ...prices],
    }
  })

  return { symbols, stockQueryPeriod, results }
}
