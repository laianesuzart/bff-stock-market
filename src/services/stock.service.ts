import { fetchStockQuote } from '../providers/market.provider'
import { calculateRange } from '../utils/date.utils'

export async function getStockWithHistory(
  tickers: string[],
  start: Date,
  end: Date,
) {
  const range = calculateRange(start)
  const output = []
  for (const ticker of tickers) {
    const res = await fetchStockQuote(ticker, range)
    const filteredHistory = res.history.filter((h) => {
      const isAfterStart = h.date >= start
      const isBeforeEnd = h.date <= end

      return isAfterStart && isBeforeEnd
    })
    output.push({ ...res, history: filteredHistory })
  }

  return output
}
